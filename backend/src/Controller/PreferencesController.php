<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Preference;
use App\Entity\Province;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Route('/preferences', name: 'app_preferences')]
final class PreferencesController extends AbstractController
{
    /**
     * Create dating/matching preferences for a user.
     *
     * This endpoint handles the creation of user preferences by:
     * 1. Processing preference data including province, gender, and birthdate
     * 2. Validating that required fields are present
     * 3. Verifying that the user exists in the system
     * 4. Calculating appropriate age range based on user's own age
     * 5. Creating and persisting a new Preference entity
     *
     * The preferences will be used for matching algorithms to find compatible users
     * based on location, gender preference, and age range.
     *
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param Request $request Request containing preference data in JSON format
     *
     * @return JsonResponse Returns success or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Preferences successfully created
     * - 400 Bad Request: Missing required fields
     * - 404 Not Found: User with specified ID does not exist
     */
    #[Route('', name: 'app_create_preferences', methods: ['POST'])]
    public function createPreferencesForUser(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        // Parse JSON request data
        $data = json_decode($request->getContent(), true);
        $userId = $data['user_id'];
        $province = $data['province'];
        $genre = $data['genre'];
        $birtdate = $data['birthdate'];

        // Validate required fields
        if (empty($userId) || empty($province) || empty($genre) || empty($birtdate)) {
            return new JsonResponse('empty-fields', Response::HTTP_BAD_REQUEST);
        }

        // Find the user in the database
        $repositoryUsers = $entityManager->getRepository(User::class);
        $user = $repositoryUsers->find($userId);

        // Check if user exists
        if (!$user) {
            return new JsonResponse('user-not-found', Response::HTTP_NOT_FOUND);
        }

        // Fetch related entities from database
        $repositoryProvince = $entityManager->getRepository(Province::class);
        $province = $repositoryProvince->findOneBy(['name' => $province]);

        $repositoryGender = $entityManager->getRepository(Gender::class);
        $gender = $repositoryGender->find($genre);

        // Calculate user age for age preference range
        $actualYear = (int) date("Y");
        $year = explode("-", $birtdate);
        $profileYear = (int) $year[0];
        $ageProfile = $actualYear - $profileYear;

        // Create new preference object
        $preferences = new Preference();
        $preferences->setUser($user);

        // Set age range with current age as minimum and current age + 5 as maximum
        $preferences->setAgeMin($ageProfile);
        $preferences->setAgeMax($ageProfile + 5);

        // Set location and gender preferences
        $preferences->setProvince($province);
        $preferences->setGender($gender);

        // Save to database
        $entityManager->persist($preferences);
        $entityManager->flush();

        // Return success response
        return new JsonResponse();
    }

    /**
     * Update a user's preferences.
     *
     * This endpoint handles updating a user's preferences by:
     * 1. Parsing the request data for preference parameters (province, gender, age range)
     * 2. Retrieving the user's existing preference record
     * 3. Updating the age range values (minimum and maximum)
     * 4. Finding and setting the gender preference with validation
     * 5. Optionally setting province preference with validation
     * 6. Saving the updated preferences to the database
     *
     * @param int $id User ID whose preferences are being updated
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param Request $request Request containing updated preference data
     *
     * @return JsonResponse Returns confirmation of preference update or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Preferences successfully updated
     * - 400 Bad Request: Invalid province selection
     * - 404 Not Found: Gender preference not found
     * - 500 Internal Server Error: Unexpected exception during processing
     */
    #[Route('/update/{id}', name: 'app_update_preferences', methods: ['PUT'])]
    public function updatePreferences(int $id, EntityManagerInterface $entityManager, Request $request)
    {
        try {
            // Parse request data
            $data = $request->toArray();
            $provinceName = $data['province'] ?? null;
            $genderName = $data['gender'];
            $minAge = $data['minAge'];
            $maxAge = $data['maxAge'];

            // Retrieve user's existing preferences
            $preferenceRepository = $entityManager->getRepository(Preference::class);
            $preference = $preferenceRepository->findOneBy(["user" => $id]);

            // Update age range values
            $preference->setAgeMin($minAge);
            $preference->setAgeMax($maxAge);

            // Find and set gender preference
            $genderRepository = $entityManager->getRepository(Gender::class);
            $gender = $genderRepository->findOneBy(['name' => $genderName]);
            if (!$gender) {
                return new JsonResponse(['success' => false, 'message' => 'Preferences not found for user'], Response::HTTP_NOT_FOUND);
            }
            $preference->setGender($gender);

            // Optionally set province preference if provided
            if (!empty($provinceName)) {
                $provinceRepository = $entityManager->getRepository(Province::class);
                $province = $provinceRepository->findOneBy(['name' => $provinceName]);
                if (!$province) {
                    return new JsonResponse(['success' => false, 'message' => 'Invalid province selection'], Response::HTTP_BAD_REQUEST);
                }
                $preference->setProvince($province);
            } else {
                $preference->setProvince(null);
            }

            // Save changes to database
            $entityManager->flush();

            // Return success response
            return new JsonResponse(['success' => true, 'message' => 'Preferences updated successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            // Handle unexpected errors
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieve user preferences by user ID.
     *
     * This endpoint handles fetching a specific user's preferences by:
     * 1. Retrieving the preference record associated with the provided user ID
     * 2. Converting the preferences to an array format for the response
     * 3. Returning the preferences data in JSON format
     *
     * @param int $id User ID whose preferences are being retrieved
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns the user's preferences data or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Preferences successfully retrieved
     * - 404 Not Found: No preferences found for the specified user
     * - 500 Internal Server Error: Unexpected exception during processing
     */
    #[Route('/{id}', name: 'app_get_preferences', methods: ['GET'])]
    public function getPreferences(int $id, EntityManagerInterface $entityManager)
    {
        try {
            // Query the database for user preferences
            $preferencesRepository = $entityManager->getRepository(Preference::class);
            $preferences = $preferencesRepository->findOneBy(['user' => $id]);

            // Check if preferences exist for the specified user
            if (!$preferences) {
                return new JsonResponse(['error' => 'preferences not found'], Response::HTTP_NOT_FOUND);
            } else {
                // Convert preferences object to array format
                $preferencesdata = $preferences->toArray();
            }

            // Return preferences data
            return new JsonResponse($preferencesdata, Response::HTTP_OK);
        } catch (\Exception $e) {
            // Handle unexpected errors
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
