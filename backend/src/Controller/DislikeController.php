<?php

namespace App\Controller;

use App\Entity\Dislike;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/dislike', name: 'app_like')]
final class DislikeController extends AbstractController
{
    /**
     * Add a dislike from one user to another.
     *
     * This endpoint handles the creation of a dislike relationship by:
     * 1. Parsing the disliked user's ID from the request body
     * 2. Validating the existence of both disliker and disliked users
     * 3. Checking if the dislike already exists
     * 4. Creating a new dislike entry with the current timestamp if it doesn't exist
     * 5. Persisting the dislike entity to the database
     *
     * @param int $user_id ID of the user who is disliking another user
     * @param Request $request Request containing the disliked user's ID in JSON format
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns status of the dislike operation
     *
     * HTTP Status Codes:
     * - 200 OK: Dislike successfully added or already exists
     * - 404 Not Found: One or both users not found
     */
    #[Route(path: '/{user_id}', name: 'app_add_dislike', methods: ['POST'])]
    public function addDislike(int $user_id, Request $request, EntityManagerInterface $entityManager)
    {
        // Parse request data
        $data = $request->toArray();
        $disliked_id = $data['disliked_id'] ?? null;

        // Fetch disliker and disliked user entities
        $disliker = $entityManager->getRepository(User::class)->find($user_id);
        $disliked = $entityManager->getRepository(User::class)->find($disliked_id);

        // Validate both users exist
        if (!$disliker || !$disliked) {
            return new JsonResponse('user not found', Response::HTTP_NOT_FOUND);
        }

        // Check for existing dislike relationship
        $existingDislike = $entityManager->getRepository(Dislike::class)->findOneBy([
            'disliker' => $disliker,
            'disliked' => $disliked,
        ]);

        // Return early if dislike already exists
        if ($existingDislike) {
            return new JsonResponse('dislike already exist', Response::HTTP_OK);
        }

        // Create new dislike entry
        $dislike = new Dislike();
        $dislike->setDisliker($disliker);
        $dislike->setDisliked($disliked);
        $dislike->setDislikedAt(new \DateTimeImmutable());

        // Persist to database
        $entityManager->persist($dislike);
        $entityManager->flush();

        // Return success response
        return new JsonResponse('dislike successfully added', Response::HTTP_OK);
    }
}
