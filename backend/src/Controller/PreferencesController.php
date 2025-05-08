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
}
