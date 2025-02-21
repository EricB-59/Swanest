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
    #[Route(path:'/find/{id}', name: 'app_find_user', methods: ['GET'])]
    public function find(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $userData = [
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'profile' => [
                'gender' => $user->getProfile()->getGender()->getName(),
                'province' => $user->getProfile()->getProvince()->getName(),
                'bio' => $user->getProfile()->getBio(),
                'first_name' => $user->getProfile()->getFirstName(),
                'last_name' => $user->getProfile()->getLastName(),
                'birthdate' => $user->getProfile()->getBirthdate()->format('Y-m-d')
            ]
        ];

        return new JsonResponse($userData, Response::HTTP_OK);
    }
}
