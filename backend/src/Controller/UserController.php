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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

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
     * Create a new user account in the system.
     * 
     * This endpoint handles the registration of new users by:
     * 1. Validating input data (username, email, password)
     * 2. Checking for duplicate usernames and emails
     * 3. Validating email format
     * 4. Ensuring username contains only alphanumeric characters
     * 5. Enforcing password complexity requirements (lowercase, uppercase, digit, min length)
     * 6. Securely hashing the password before storage
     * 7. Setting creation timestamp with Europe/Madrid timezone
     * 
     * @param Request $request Request containing user data in JSON format
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param UserPasswordHasherInterface $passwordHasher Service for secure password hashing
     * 
     * @return JsonResponse Returns user data on success or error message on failure
     * 
     * HTTP Status Codes:
     * - 200 OK: User successfully created
     * - 400 Bad Request: Validation errors (missing fields, duplicate user/email, invalid format)
     */
    #[Route('/create', name: 'app_user_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        // Parse JSON data from request body
        $data = json_decode($request->getContent(), true);
        $username = $data['username'];
        $email = $data['email'];
        $password = $data['password'];

        // Guard clause: Ensure no required fields are empty
        // This prevents processing incomplete registration data
        if (empty($username) || empty($email) || empty($password)) {
            return new JsonResponse('Empty fields', Response::HTTP_BAD_REQUEST);
        }

        // Guard clause: Check for username uniqueness
        // Prevents duplicate usernames in the system
        $repeatedUser = $entityManager->getRepository(User::class)->findBy(['username' => $username]);
        if ($repeatedUser) {
            return new JsonResponse('Repeated user', Response::HTTP_BAD_REQUEST);
        }

        // Guard clause: Check for email uniqueness
        // Ensures each account has a unique email address
        $repeatedEmail = $entityManager->getRepository(User::class)->findBy(['email' => $email]);
        if ($repeatedEmail) {
            return new JsonResponse('Repeated email', Response::HTTP_BAD_REQUEST);
        }

        // Guard clause: Validate email format
        // Ensures email follows standard format using PHP's built-in filter
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse('Invalid email', Response::HTTP_BAD_REQUEST);
        }

        // Guard clause: Validate username format
        // Ensures username contains only alphanumeric characters
        $regexUsername = '^[a-zA-Z0-9]+$^';
        if (!preg_match($regexUsername, $username)) {
            return new JsonResponse('Invalid username', Response::HTTP_BAD_REQUEST);
        }

        // Guard clause: Enforce password complexity
        // Password must contain at least: 
        // - 8 characters
        // - One lowercase letter
        // - One uppercase letter
        // - One digit
        $regexPassword = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$^';
        if (!preg_match($regexPassword, $password)) {
            return new JsonResponse('Invalid password', Response::HTTP_BAD_REQUEST);
        }

        // Create new user entity
        $user = new User();
        $user->setUsername($username);
        $user->setEmail($email);

        // Security: Hash password before storing
        // This prevents plain text passwords in the database
        $hashedPassword = $passwordHasher->hashPassword(
            $user,
            $password
        );
        $user->setPassword($hashedPassword);

        // Set creation timestamp with Europe/Madrid timezone
        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $user->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        // Persist user to database
        $entityManager->persist($user);
        $entityManager->flush();

        // Return success response with non-sensitive user data
        // Note: Password is deliberately excluded from response
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
    public function login(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);

        $identifier = $data['identifier'];
        $password = $data['password'];

        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->findByEmailOrUsername($identifier);

        if (!$user) {
            return $this->json("user not found", Response::HTTP_NOT_FOUND);
        }

        if (!($passwordHasher->isPasswordValid($user, $password))) {
            return $this->json(false, Response::HTTP_NOT_FOUND);
        }
        return new JsonResponse($user->toArray(), Response::HTTP_OK);
    }
}
