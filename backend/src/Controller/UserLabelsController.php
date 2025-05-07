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
    #[Route(path: '', name: 'get_labels', methods: ['GET'])]
    public function getLabels(EntityManagerInterface $entityManager): JsonResponse
    {
        $labels = $entityManager->getRepository(Label::class)->findAll();

        // Transform the entities into a simple array with id and name
        $data = array_map(fn($label) => [
            'id' => $label->getId(),
            'name' => $label->getName(),
        ], $labels);

        return new JsonResponse($data, Response::HTTP_OK);
    }
}
