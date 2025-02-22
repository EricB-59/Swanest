<?php

namespace App\Controller;

use App\Entity\User;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/create', name: 'app_user_create', methods: ['POST'])]
    public function createUser(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        if (empty($username) || empty($email) || empty($password)) {
            return new JsonResponse('Empty fields', Response::HTTP_BAD_REQUEST);
        }

        $repeatedEmail = $entityManager->getRepository(User::class)->findBy(['email' => $email]);
        if ($repeatedEmail) {
            return new JsonResponse('Repeted Email', Response::HTTP_BAD_REQUEST);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse('Invalid email', Response::HTTP_BAD_REQUEST);
        }

        $regexPattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$^';
        if (!preg_match($regexPattern, $password)) {
            return new JsonResponse('Invalid password', Response::HTTP_BAD_REQUEST);
        }

        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);

        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $user->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse('User: ' . $user->getUsername() . ' created', Response::HTTP_OK);
    }
}
