<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/user', name: 'app_user')]
final class UserController extends AbstractController
{
    #[Route('/test', name: 'app_user_test')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your user controller',
        ]);
    }
    #[Route('/delete/{id}', 'app_user_delete', methods:['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse {
        $repositoryUsers = $entityManager->getRepository(User::class);
        $user = $repositoryUsers->findOneBy(['id' => $id]);
        if($user != null) {
            $entityManager->remove($user);
            $entityManager->flush();
            return new JsonResponse(Response::HTTP_OK);
         } else {
            return new JsonResponse('Ese ID de usuario es inexistente!',Response::HTTP_NOT_FOUND);
         }
    }
}
