<?php

namespace App\Controller;

use App\Entity\Images;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
#[Route('/images', name: 'app_images')]
final class ImagesController extends AbstractController
{
    #[Route('/{id}', name: 'app_images', methods: ['GET'])]
    public function getImages (int $id, EntityManagerInterface $entityManager): Response {
        $imagesRepository = $entityManager->getRepository(Images::class);
        $images = $imagesRepository->findOneBy(['user' => $id]);
        return new JsonResponse($images->toArray(),Response::HTTP_OK );
    }
}
