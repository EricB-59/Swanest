<?php

namespace App\Controller;

use App\Entity\Dislike;
use App\Entity\Like;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/like', name: 'app_like')]
final class LikeController extends AbstractController
{
    /**
     * Add a like from one user to another.
     *
     * This endpoint handles the logic for a user liking another user:
     * 1. Parses the JSON request data to get the liked user ID
     * 2. Validates both liker and liked users exist
     * 3. Removes any existing dislike between the users
     * 4. Checks for existing like to prevent duplicates
     * 5. Creates and persists a new like entry with timestamp
     *
     * @param int $user_id The ID of the user performing the like action
     * @param Request $request HTTP request containing 'liked_id' in JSON body
     * @param EntityManagerInterface $entityManager Doctrine entity manager for DB operations
     *
     * @return JsonResponse JSON response indicating success or error
     *
     * HTTP Status Codes:
     * - 200 OK: Like successfully added or already exists
     * - 404 Not Found: One or both users not found
     */
    #[Route(path: '/{user_id}', name: 'app_add_like', methods: ['POST'])]
    public function addLike(int $user_id, Request $request, EntityManagerInterface $entityManager)
    {
        // Parse request data to get the ID of the liked user
        $data = $request->toArray();
        $liked_id = $data['liked_id'] ?? null;

        // Find the liker and liked user entities
        $liker = $entityManager->getRepository(User::class)->find($user_id);
        $liked = $entityManager->getRepository(User::class)->find($liked_id);

        // Return error if either user does not exist
        if (!$liker || !$liked) {
            return new JsonResponse('user not found', Response::HTTP_NOT_FOUND);
        }

        // Remove existing dislike between the two users, if any
        $existingDislike = $entityManager->getRepository(Dislike::class)->findOneBy([
            'disliker' => $liker,
            'disliked' => $liked,
        ]);

        if ($existingDislike) {
            $entityManager->remove($existingDislike);
        }

        // Check if a like already exists to avoid duplication
        $existingLike = $entityManager->getRepository(Like::class)->findOneBy([
            'liker' => $liker,
            'liked' => $liked,
        ]);

        if ($existingLike) {
            return new JsonResponse('like already exist', Response::HTTP_OK);
        }

        // Create and save the new like
        $like = new Like();
        $like->setLiker($liker);
        $like->setLiked($liked);
        $like->setLikedAt(new \DateTimeImmutable());

        $entityManager->persist($like);
        $entityManager->flush();

        return new JsonResponse('like successfully added', Response::HTTP_OK);
    }
}
