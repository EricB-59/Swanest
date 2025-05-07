<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Label;
use App\Entity\UserLabel;
use App\Entity\Profile;
use App\Entity\User;
use App\Entity\Province;
use App\Entity\Images;
use DateTime;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

use function Symfony\Component\Clock\now;

#[Route('/profile', name: 'app_profile')]
final class ProfileController extends AbstractController
{
    /**
     * Create a new user profile with personal information and preferences.
     *
     * This endpoint handles profile creation by:
     * 1. Validating required profile fields (name, bio, gender, birthdate, province)
     * 2. Performing data validation checks:
     *    - Name contains only letters
     *    - Surname contains only letters and spaces
     *    - Bio length is within acceptable limits
     *    - User is at least 18 years old
     * 3. Checking if user already has a profile to prevent duplicates
     * 4. Creating relationships with other entities (Gender, Province, Labels)
     * 5. Setting creation and update timestamps with Europe/Madrid timezone
     * 6. Persisting the profile data to the database
     *
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param Request $request Request containing profile data in JSON format
     *
     * @return JsonResponse Returns success message or validation error details
     *
     * HTTP Status Codes:
     * - 200 OK: Profile successfully created
     * - 400 Bad Request: Validation errors (empty fields, format issues, age restriction)
     * - 409 Conflict: User already has an existing profile
     */
    #[Route(path: '', name: 'app_profile_create', methods: ['POST'],)]
    public function create(EntityManagerInterface $entityManager, Request $request)
    {
        // Parse JSON request data
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'];
        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $bio = $data["bio"];
        $gender = $data["gender"];
        $birthDate = $data["birthdate"];
        $province = $data["province"];
        $labels = $data['labels'];

        // Fetch related entities from database
        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id' => $gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['name' => $province]);
        $newBirthDate = new DateTime($birthDate, null);

        // Validate required fields
        if (empty($firstName) || empty($lastName) || empty($bio) || empty($gender) || empty($birthDate) || empty($province)) {
            return new JsonResponse('No empty fields!', Response::HTTP_BAD_REQUEST);
        }

        // Validate name format (letters only)
        if (!preg_match('/^[a-zA-Z]+$/', $firstName)) {
            return new JsonResponse('Only allow letters in the name', Response::HTTP_BAD_REQUEST);
        }

        // Validate last name format (letters and spaces)
        if (!preg_match('/^[a-zA-Z ]+$/', $lastName)) {
            return new JsonResponse('Only allow letters in the surname', Response::HTTP_BAD_REQUEST);
        }

        // Validate bio length
        if (strlen($bio) > 255) {
            return new JsonResponse('Bio too long', Response::HTTP_BAD_REQUEST);
        }

        // Validate user age (must be 18+)
        $actualYear = (int) date("Y");
        $year = explode("-", $birthDate);
        $profileYear = (int) $year[0];
        if (($actualYear - $profileYear) < 18) {
            return new JsonResponse('Wrong age', Response::HTTP_BAD_REQUEST);
        }

        // Create new profile object
        $profile = new Profile();
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userId]);

        // Check if user already has a profile
        $existingProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $user]);
        if ($existingProfile) {
            return new JsonResponse('User already has a profile', Response::HTTP_CONFLICT);
        }

        // Set profile basic information
        $profile->setUser($user);
        $profile->setFirstName($firstName);
        $profile->setLastName($lastName);
        $profile->setBio($bio);
        $profile->setGender($newGender);
        $profile->setBirthdate($newBirthDate);
        $profile->setProvince($newProvince);

        // Set user labels/tags for interests or preferences
        $labelRepository = $entityManager->getRepository(Label::class);
        $newLabels = new UserLabel;
        $newLabels->setFirstLabel($labelRepository->findOneBy(['name' => $labels['first_label']]));
        $newLabels->setSecondLabel($labelRepository->findOneBy(['name' => $labels['second_label']]));
        $newLabels->setThirdLabel($labelRepository->findOneBy(['name' => $labels['third_label']]));
        $newLabels->setFourthLabel($labelRepository->findOneBy(['name' => $labels['fourth_label']]));
        $newLabels->setFifthLabel($labelRepository->findOneBy(['name' => $labels['fifth_label']]));
        $profile->setLabels($newLabels);

        // Set timestamps with Madrid timezone
        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $profile->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));
        $profile->setUpdatedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        // Save to database
        $entityManager->persist($profile);
        $entityManager->flush();

        // Return success response
        return new JsonResponse('Profile Created succesfully!', Response::HTTP_OK);
    }

    /**
     * Retrieve a user profile by its ID.
     *
     * This endpoint handles profile retrieval by:
     * 1. Finding the profile by its unique identifier
     * 2. Converting the profile entity to an array representation
     * 3. Returning the profile data or appropriate error message
     *
     * @param int $id The unique identifier of the profile to retrieve
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns profile data or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Profile successfully retrieved, returns profile data
     * - 404 Not Found: Profile with specified ID does not exist
     */
    #[Route(path: '/{id}', name: 'app_profile_get', methods: ['GET'])]
    public function getProfile(int $id, EntityManagerInterface $entityManager)
    {
        // Access the profile repository and attempt to find the profile by ID
        $profileRepository = $entityManager->getRepository(Profile::class);
        $profile = $profileRepository->find($id);

        // Return error response if profile doesn't exist
        if (!$profile) {
            return new JsonResponse(
                ['message' => 'profile-not-found'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Return profile data as JSON response
        return new JsonResponse($profile->toArray());
    }

    /**
     * Update an existing user profile with new information.
     *
     * This endpoint handles profile updates by:
     * 1. Processing the update data for bio, province, gender, labels, and images
     * 2. Validating that required fields are present
     * 3. Checking that the user and profile exist
     * 4. Creating or updating the associated Images entity
     * 5. Updating the user's labels/interests
     * 6. Setting an updated timestamp for the profile
     * 7. Handling any exceptions during the update process
     *
     * @param int $id The unique identifier of the user whose profile should be updated
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param Request $request Request containing updated profile data in JSON format
     *
     * @return JsonResponse Returns updated user data or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Profile successfully updated, returns user data
     * - 400 Bad Request: Missing required fields or profile/user not found
     * - 500 Internal Server Error: Unexpected error during update process
     */
    #[Route(path: '/{id}', name: 'app_profile_update', methods: ['PUT'],)]
    public function updateProfile(int $id, EntityManagerInterface $entityManager, Request $request)
    {
        // Parse JSON request data
        $data = json_decode($request->getContent(), true);

        $bio = $data["bio"];
        $province = $data["province"];
        $gender = $data["gender"];
        $labels = $data["labels"];
        $images = $data["images"];

        // Fetch related entities from database
        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id' => $gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['id' => $province]);

        // Find user and profile to update
        $updateProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $id]);
        $updateUser = $entityManager->getRepository(User::class)->find($id);

        // Validate profile exists
        if (!$updateProfile) {
            return new JsonResponse('profile-not-found', Response::HTTP_BAD_REQUEST);
        }

        // Validate user exists
        if (!$updateUser) {
            return new JsonResponse('user-not-found', Response::HTTP_BAD_REQUEST);
        }

        // Validate all required fields are present
        if (empty($bio) || empty($gender) || empty($labels) || empty($province) || empty($images)) {
            return new JsonResponse('empty-fields', Response::HTTP_BAD_REQUEST);
        }

        // Validate mandatory images are present
        if (empty($images['image_1']) || empty($images['image_2'])) {
            return new JsonResponse('empty-mandatory-fields', Response::HTTP_BAD_REQUEST);
        }

        try {
            // Update or create images
            $newImages = $updateUser->getImage();
            if (!$newImages) {
                $newImages = new Images();
                $newImages->setUser($updateUser);
            }

            // Set image values with null-coalescing for optional images
            $newImages->setImage1($images['image_1']);
            $newImages->setImage2($images['image_2']);
            $newImages->setImage3($images['image_3'] ?? null);
            $newImages->setImage4($images['image_4'] ?? null);
            $newImages->setImage5($images['image_5'] ?? null);
            $newImages->setUploadedAt(new DateTimeImmutable);

            // Save images and link to user
            $entityManager->persist($newImages);
            $updateUser->setImage($newImages);

            // Update user labels/interests
            $newLabels = $updateProfile->getLabels();
            if ($newLabels) {
                // Update each label with new ID and name values
                $firstLabel = $newLabels->getFirstLabel();
                $firstLabel->setId($labels['first_label']['id']);
                $firstLabel->setName($labels['first_label']['name']);

                $secondLabel = $newLabels->getSecondLabel();
                $secondLabel->setId($labels['second_label']['id']);
                $secondLabel->setName($labels['second_label']['name']);

                $thirdLabel = $newLabels->getThirdLabel();
                $thirdLabel->setId($labels['third_label']['id']);
                $thirdLabel->setName($labels['third_label']['name']);

                $fourthLabel = $newLabels->getFourthLabel();
                $fourthLabel->setId($labels['fourth_label']['id']);
                $fourthLabel->setName($labels['fourth_label']['name']);

                $fifthLabel = $newLabels->getFifthLabel();
                $fifthLabel->setId($labels['fifth_label']['id']);
                $fifthLabel->setName($labels['fifth_label']['name']);

                // Set updated labels on the labels entity
                $newLabels->setFirstLabel($firstLabel);
                $newLabels->setSecondLabel($secondLabel);
                $newLabels->setThirdLabel($thirdLabel);
                $newLabels->setFourthLabel($fourthLabel);
                $newLabels->setFifthLabel($fifthLabel);
                $entityManager->persist($newLabels);
            }

            // Update main profile fields
            $updateProfile->setBio($bio);
            $updateProfile->setGender($newGender);
            $updateProfile->setProvince($newProvince);
            $updateProfile->setUpdatedAt(new DateTimeImmutable);
            $entityManager->persist($updateProfile);

            // Save all changes to database
            $entityManager->flush();

            // Return updated user data
            return new JsonResponse($updateUser->toArray(), Response::HTTP_OK);
        } catch (\Exception $e) {
            // Log the error and return error response
            error_log($e->getMessage());
            return new JsonResponse(['error' => 'Error al actualizar el perfil: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
