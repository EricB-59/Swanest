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
    #[Route(path: '', name: 'app_provinces', methods: ['GET'])]
    public function getProvinces(EntityManagerInterface $entityManager)
    {
        $provinces = $entityManager->getRepository(Province::class)->findAll();

        // Transform the entities into a simple array with id and name
        $data = array_map(fn($province) => [
            'id' => $province->getId(),
            'name' => $province->getName(),
        ], $provinces);

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
