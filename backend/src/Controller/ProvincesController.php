<?php

namespace App\Controller;

use App\Entity\Province;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route(path: '/provinces', name: 'app_provinces')]
final class ProvincesController extends AbstractController
{
    /**
     * Retrieve all provinces/regions from the system.
     *
     * This endpoint provides a complete list of geographical provinces that can be:
     * 1. Selected for user profiles as location information
     * 2. Used for filtering or geographical categorization
     * 3. Displayed in location selection dropdowns
     *
     * The function transforms each Province entity into a simplified array
     * containing only the essential identifiers and display values.
     *
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns array of all provinces with their IDs and names
     *
     * HTTP Status Codes:
     * - 200 OK: Provinces successfully retrieved
     */
    #[Route(path: '', name: 'app_provinces', methods: ['GET'])]
    public function getProvinces(EntityManagerInterface $entityManager)
    {
        // Retrieve all province entities from the database
        $provinces = $entityManager->getRepository(Province::class)->findAll();

        // Transform the entities into a simple array with id and name
        $data = array_map(
            fn($province) => [
                'id' => $province->getId(),
                'name' => $province->getName(),
            ],
            $provinces
        );

        // Return the formatted province data
        return new JsonResponse($data, Response::HTTP_OK);
    }
}
