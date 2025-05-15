<?php

namespace App\Controller;

use App\Entity\Matche;
use App\Entity\Preference;
use App\Entity\Profile;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/match', name: 'app_match')]
final class MatchController extends AbstractController
{
    /**
     * Retrieve matching user profiles based on preferences.
     *
     * This endpoint fetches user profiles that match the preferences of the logged-in user:
     * 1. Retrieves the user's preferences (age range, gender, and province)
     * 2. If no preferences are found, it falls back to default values
     * 3. Searches for profiles that match the user's preferences
     * 4. Fetches additional details like user images and prepares the result
     * 5. Returns the list of matching profiles or an error message if no profiles are found
     *
     * @param int $id The ID of the user whose matching profiles are being retrieved
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse JSON response with a list of matching profiles or an error message
     *
     * HTTP Status Codes:
     * - 200 OK: Profiles successfully retrieved
     * - 404 Not Found: No profiles found matching the preferences
     */
    #[Route('/profiles/{id}', 'app_match_profiles', methods: ['GET'])]
    public function getMatchProfiles(int $id, EntityManagerInterface $entityManager)
    {
        // Retrieve the repository for user preferences
        $preferencesRepository = $entityManager->getRepository(Preference::class);

        // Fetch the preferences for the given user
        $userPreferences = $preferencesRepository->findOneBy(['user' => $id]);

        // If no preferences are found, set default values
        if (!$userPreferences) {
            $minAge = null;
            $maxAge = null;
            $gender = null;
            $province = null;
        } else {
            // Use the user's saved preferences
            $minAge = $userPreferences->getAgeMin();
            $maxAge = $userPreferences->getAgeMax();
            $gender = $userPreferences->getGender()->getName();
            $province = $userPreferences->getProvince()->getName();
        }

        // Retrieve profiles matching the user's preferences
        $profileRepository = $entityManager->getRepository(Profile::class);
        $profiles = $profileRepository->findProfiles(
            $id,
            $minAge,
            $maxAge,
            $gender,
            $province
        );

        // Prepare the response by including profile details and associated images
        $userRepository = $entityManager->getRepository(User::class);
        $profilesArray = [];

        foreach ($profiles as $profile) {
            $user = $userRepository->find($profile->getUser()->getId());
            $image = $user->getImage();

            // Append profile data and image to the result array
            $profilesArray[] = [
                $profile->toArray(),
                ($image ? $image->toArray() : [])
            ];
        }

        // If no profiles are found, return a 404 error
        if (empty($profiles)) {
            return new JsonResponse('Profiles not found.', Response::HTTP_NOT_FOUND);
        }

        // Return the list of matching profiles along with images
        return new JsonResponse($profilesArray, Response::HTTP_OK);
    }

    /**
     * Retrieve the count of matching profiles for a given user.
     *
     * This endpoint counts the number of matches for the specified user:
     * 1. Fetches all match records where the given user is user1
     * 2. Returns the total count of matches
     *
     * @param int $id The ID of the user whose match count is being retrieved
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse JSON response with the match count
     *
     * HTTP Status Codes:
     * - 200 OK: Successfully retrieved the match count
     */
    #[Route('/{id}', 'app_count_profiles', methods: ['GET'])]
    public function getMatchCount(int $id, EntityManagerInterface $entityManager)
    {
        // Retrieve the repository for matches
        $matchRepository = $entityManager->getRepository(Matche::class);

        // Find all matches where the user is the first participant (user1)
        $matchs = $matchRepository->findBy(['user1' => $id]);

        // Return the count of matching profiles
        return new JsonResponse(count($matchs), Response::HTTP_OK);
    }
}
