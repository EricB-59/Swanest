<?php

namespace App\Controller;

use App\Entity\Images;
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
    #[Route('', name: 'app_user_create', methods: ['POST'])]
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

        // Enforce password complexity requirements
        // Requires:
        // - At least 8 characters
        // - At least one lowercase letter
        // - At least one uppercase letter
        // - At least one digit
        // $regexPassword = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$^';
        $regexPassword = '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}$^';

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
            "id" => $user->getId(),
            "username" => $user->getUsername(),
            "email" => $user->getEmail()
        ], Response::HTTP_OK);
    }

    /**
     * Authenticate user and provide access to the system.
     *
     * This endpoint handles user authentication by:
     * 1. Receiving user credentials (email/username and password)
     * 2. Searching for the user in the database by email or username
     * 3. Verifying the provided password against the stored hash
     * 4. Generating appropriate error responses for failed authentication
     * 5. Returning user data on successful authentication
     *
     * @param Request $request Request containing login credentials in JSON format
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param UserPasswordHasherInterface $passwordHasher Service for password validation
     *
     * @return JsonResponse Returns user data on success or error message on failure
     *
     * HTTP Status Codes:
     * - 200 OK: Authentication successful, returns user data
     * - 404 Not Found: User not found or invalid credentials
     */
    #[Route('/login', 'app_user_login', methods: ['POST'])]
    public function login(
        Request $request,                      // Object containing HTTP request information
        EntityManagerInterface $entityManager, // Service for database interaction
        UserPasswordHasherInterface $passwordHasher // Service for password validation
    ): JsonResponse {
        // Parse the JSON request body
        $data = json_decode($request->getContent(), true);
        $identifier = $data['identifier'];  // Could be email or username
        $password = $data['password'];

        // Query the database to find the user
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->findByEmailOrUsername($identifier);

        // Return error if user not found
        if (!$user) {
            return $this->json("user not found", Response::HTTP_NOT_FOUND);
        }

        // Verify password and return error if invalid
        if (!($passwordHasher->isPasswordValid($user, $password))) {
            return $this->json(false, Response::HTTP_NOT_FOUND);
        }

        // Authentication successful - return user data
        return new JsonResponse($user->toArray(), Response::HTTP_OK);
    }

    /**
     * Delete a user account from the system.
     *
     * This endpoint handles user deletion by:
     * 1. Finding the user by their unique ID
     * 2. Removing the user entity from the database
     * 3. Providing appropriate response based on operation result
     *
     * @param int $id The unique identifier of the user to delete
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns confirmation message or error notification
     *
     * HTTP Status Codes:
     * - 200 OK: User successfully deleted
     * - 404 Not Found: User with specified ID does not exist
     */
    #[Route('/{id}', 'app_user_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Retrieve the user repository and attempt to find the user by ID
        $repositoryUsers = $entityManager->getRepository(User::class);
        $user = $repositoryUsers->find($id);

        // Return error response if user doesn't exist
        if (!$user) {
            return new JsonResponse('user-not-found', Response::HTTP_NOT_FOUND);
        }

        // Remove the user from the database and persist the changes
        $entityManager->remove($user);
        $entityManager->flush();

        // Return success response
        return new JsonResponse('user-removed', Response::HTTP_OK);
    }

    /**
     * Add profile images for a user.
     *
     * This endpoint handles the addition of multiple images to a user profile by:
     * 1. Receiving image data and user ID via JSON payload
     * 2. Validating that required fields (user ID, image_1, image_2) are present
     * 3. Verifying the user exists in the database
     * 4. Creating a new Images entity linked to the user
     * 5. Setting a creation timestamp with Europe/Madrid timezone
     * 6. Persisting the image data to the database
     *
     * @param Request $request Request containing user ID and image data in JSON format
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns success/failure status
     *
     * HTTP Status Codes:
     * - 200 OK: Images successfully added to user profile
     * - 400 Bad Request: Missing required fields (id, image_1, image_2)
     * - 404 Not Found: User with specified ID does not exist
     */
    #[Route('/images', 'app_add_images', methods: ['POST'])]
    public function addImages(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Parse JSON request data
        $data = json_decode($request->getContent(), true);
        $id = $data['id'];
        $image_1 = $data['image_1'];
        $image_2 = $data['image_2'];
        $image_3 = $data['image_3'];
        $image_4 = $data['image_4'];
        $image_5 = $data['image_5'];

        // Validate required fields
        if (empty($id) || empty($image_1) || empty($image_2)) {
            return new JsonResponse(false, Response::HTTP_BAD_REQUEST);
        }

        // Find the user in the database
        $repositoryUsers = $entityManager->getRepository(User::class);
        $user = $repositoryUsers->find($id);

        // Check if user exists
        if (!$user) {
            return new JsonResponse(false, Response::HTTP_NOT_FOUND);
        }

        // Create and populate new Images entity
        $images = new Images;
        $images->setUser($user);
        $images->setImage1($image_1);
        $images->setImage2($image_2);
        $images->setImage3($image_3);
        $images->setImage4($image_4);
        $images->setImage5($image_5);

        // Set timestamp with Madrid timezone
        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $images->setUploadedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        // Save to database
        $entityManager->persist($images);
        $entityManager->flush();

        // Return success response
        return new JsonResponse(true, Response::HTTP_OK);
    }
}
