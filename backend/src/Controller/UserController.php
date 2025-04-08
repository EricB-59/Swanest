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

    /**
     * Comprehensive user registration validation checks
     * 
     * These guard clauses perform multiple validations:
     * 1. Check for empty required fields
     * 2. Prevent duplicate usernames
     * 3. Prevent duplicate emails
     * 4. Validate email format
     * 5. Validate username format
     * 6. Enforce password complexity
     */
    #[Route('/create', name: 'app_user_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        // Ensure no critical fields are empty
        // Prevents registration with missing essential information
        if (empty($username) || empty($email) || empty($password)) {
            return new JsonResponse('Empty fields', Response::HTTP_BAD_REQUEST);
        }

        // Check if username is already taken
        // Maintains unique usernames across the system
        $repeatedUser = $entityManager->getRepository(User::class)->findBy(['username' => $username]);
        if ($repeatedUser) {
            return new JsonResponse('Repeated user', Response::HTTP_BAD_REQUEST);
        }

        // Check if email is already registered
        // Prevents multiple accounts with the same email address
        $repeatedEmail = $entityManager->getRepository(User::class)->findBy(['email' => $email]);
        if ($repeatedEmail) {
            return new JsonResponse('Repeated email', Response::HTTP_BAD_REQUEST);
        }

        // Validate email format using built-in PHP filter
        // Ensures the email address follows a standard, valid format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse('Invalid email', Response::HTTP_BAD_REQUEST);
        }

        // Validate username format
        // Allows only alphanumeric characters
        // Prevents special characters or spaces in username
        $regexUsername = '^[a-zA-Z0-9]+$^';
        if (!preg_match($regexUsername, $username)) {
            return new JsonResponse('Invalid username', Response::HTTP_BAD_REQUEST);
        }

        // Enforce password complexity requirements
        // Requires:
        // - At least 8 characters
        // - At least one lowercase letter
        // - At least one uppercase letter
        // - At least one digit
        // $regexPassword = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$^';
        $regexPassword = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$';

        if (!preg_match($regexPassword, $password)) {
            return new JsonResponse('Invalid password', Response::HTTP_BAD_REQUEST);
        }

        // If all validations pass, proceed with the creation of the user and registration on the database
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);
        $user->setPassword($password);

        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $user->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse([
            "username" => $user->getUsername(),
            "email" => $user->getEmail()
        ], Response::HTTP_OK);
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
    public function login(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
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
                "gender" => [
                    "genderId" => $user->getProfile()->getGender()->getId(),
                    "genderName" => $user->getProfile()->getGender()->getName()
                ],
                "province" => [
                    "provinceId" =>  $user->getProfile()->getProvince()->getId(),
                    "provinceName" =>  $user->getProfile()->getProvince()->getName()

                ],
                "labels" => [
                    "label1" => [
                        "id" => $user->getProfile()->getLabels()->getFirstLabel()->getId(),
                        "name" => $user->getProfile()->getLabels()->getFirstLabel()->getName(),
                    ],
                    "label2" => [
                        "id" => $user->getProfile()->getLabels()->getSecondLabel()->getId(),
                        "name" => $user->getProfile()->getLabels()->getSecondLabel()->getName(),
                    ],
                    // "label3" => [
                    //     "id" => $user->getProfile()->getLabels()->getThirdLabel()->getId(),
                    //     "name" => $user->getProfile()->getLabels()->getThirdLabel()->getName(),
                    // ],
                    // "label4" => [
                    //     "id" => $user->getProfile()->getLabels()->getFourthLabel()->getId(),
                    //     "name" => $user->getProfile()->getLabels()->getFourthLabel()->getName(),
                    // ],
                    // "label5" => [
                    //     "id" => $user->getProfile()->getLabels()->getFifthLabel()->getId(),
                    //     "name" => $user->getProfile()->getLabels()->getFifthLabel()->getName(),
                    // ],
                ],
                "bio" => $user->getProfile()->getBio()
            ]
        ];

        if (!$user) {
            return $this->json(false, Response::HTTP_NOT_FOUND);
        }

        if (!($user->getPassword() === $password)) {
            return $this->json(false, Response::HTTP_NOT_FOUND);
        }
        return new JsonResponse($userArray, Response::HTTP_OK);
    }
}
