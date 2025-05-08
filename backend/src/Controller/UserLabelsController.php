<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Label;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/labels', name: 'app_user_labels')]

final class UserLabelsController extends AbstractController
{
    /**
     * Retrieve all available labels/tags from the system.
     *
     * This endpoint provides a complete list of labels that can be:
     * 1. Used for user profile interests
     * 2. Applied as tags to content
     * 3. Utilized for filtering or categorization
     *
     * The function transforms each Label entity into a simplified array 
     * containing only the essential identifiers and display values.
     *
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns array of all available labels with their IDs and names
     *
     * HTTP Status Codes:
     * - 200 OK: Labels successfully retrieved
     */
    #[Route(path: '', name: 'get_labels', methods: ['GET'])]
    public function getLabels(EntityManagerInterface $entityManager): JsonResponse
    {
        // Retrieve all label entities from the database
        $labels = $entityManager->getRepository(Label::class)->findAll();

        // Transform the entities into a simple array with id and name
        $data = array_map(
            fn($label) => [
                'id' => $label->getId(),
                'name' => $label->getName(),
            ],
            $labels
        );

        // Return the formatted label data
        return new JsonResponse($data, Response::HTTP_OK);
    }
}
