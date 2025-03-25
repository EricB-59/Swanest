<?php

namespace App\Controller;

use DateTimeImmutable;
use DateTimeZone;
use App\Entity\User;
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
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
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

    #[Route(path: '/find/{id}', name: 'app_find_user', methods: ['GET'])]
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

    #[Route('/delete/{id}', 'app_user_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $repositoryUsers = $entityManager->getRepository(User::class);
        $user = $repositoryUsers->findOneBy(['id' => $id]);
        if ($user != null) {
            $entityManager->remove($user);
            $entityManager->flush();
            return new JsonResponse(Response::HTTP_OK);
        } else {
            return new JsonResponse('Ese ID de usuario es inexistente!', Response::HTTP_NOT_FOUND);
        }
    }
    #[Route('/login', 'app_user_login', methods: ['POST'])]
    public function login (Request $request, EntityManagerInterface $entityManager) : JsonResponse {
        $data = json_decode($request->getContent(), true);
        $identifier = $data['identifier'];
        $password = $data['password'];
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->findByEmailOrUsername($identifier);
        $userArray = [
            "id" => $user->getId(),
            "username" => $user->getUsername(),
            "email" => $user->getEmail(),
            "password" => $user->getPassword(),
            "profile" => [
                "idProfile" => $user->getProfile()->getId(),
                "first_name" => $user->getProfile()->getFirstName(),
                "last_name" => $user->getProfile()->getLastName(),
                "birthdate" => $user->getProfile()->getBirthdate(),
                "gender" => $user->getProfile()->getGender(),
                "province" => $user->getProfile()->getProvince(),
                "bio" => $user->getProfile()->getBio()
            ]
        ]; 

        if(!$user){
            return $this->json(false, Response::HTTP_NOT_FOUND); 
        }

        if(!($user->getPassword() === $password)) {
            return $this->json(false, Response::HTTP_NOT_FOUND); 
        }
        return new JsonResponse($userArray, Response::HTTP_OK);
        
    }
}
