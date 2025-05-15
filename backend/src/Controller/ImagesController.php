<?php

namespace App\Controller;

use App\Entity\Images;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/images', name: 'app_images')]
final class ImagesController extends AbstractController
{
    /**
     * Retrieve profile images for a specific user.
     *
     * This endpoint fetches the set of profile images associated with a user by:
     * 1. Looking up the Images entity linked to the given user ID
     * 2. Returning the image paths as an associative array
     * 3. Handling the case when no images are found
     *
     * @param int $id The ID of the user whose images are being retrieved
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse JSON array of image paths or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Images successfully retrieved
     * - 404 Not Found: No images found for the given user
     */
    #[Route('/{id}', name: 'app_images', methods: ['GET'])]
    public function getImages(int $id, EntityManagerInterface $entityManager): Response
    {
        // Retrieve the repository for the Images entity
        $imagesRepository = $entityManager->getRepository(Images::class);

        // Find the Images entity associated with the given user ID
        $images = $imagesRepository->findOneBy(['user' => $id]);

        // If no images found, return a 404 response
        if (!$images) {
            return new JsonResponse(['message' => 'images-not-found'], Response::HTTP_NOT_FOUND);
        }

        // Convert the Images entity to an array and return it as a JSON response
        return new JsonResponse($images->toArray(), Response::HTTP_OK);
    }


    /**
     * Upload and associate images with a user profile.
     *
     * This endpoint allows uploading up to 5 images for a specific user by:
     * 1. Validating that the user exists
     * 2. Checking for uploaded files in the request
     * 3. Ensuring the upload directory exists
     * 4. Processing and storing each uploaded image
     * 5. Assigning image paths to the corresponding fields in the Images entity
     * 6. Saving the image information to the database
     *
     * Expected file fields in the request:
     * - image_1, image_2, image_3, image_4, image_5
     *
     * @param int $id ID of the user to associate images with
     * @param Request $request Multipart/form-data request containing image files
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns a status message indicating success or specific failure
     *
     * HTTP Status Codes:
     * - 200 OK: Images uploaded and saved successfully
     * - 400 Bad Request: No files provided or invalid file uploaded
     * - 404 Not Found: User not found
     * - 500 Internal Server Error: Error saving file to the server
     */
    #[Route(path: '/{id}', name: 'app_images_upload', methods: ['POST'])]
    public function uploadImages(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Retrieve user by ID
        $user = $entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            return new JsonResponse(['message' => 'user-not-found'], Response::HTTP_NOT_FOUND);
        }

        // Retrieve uploaded files from the request
        $files = $request->files;
        if ($files->count() === 0) {
            return new JsonResponse(['message' => 'no-files-uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Define and create the upload directory if it doesn't exist
        $uploadDir = $this->getParameter('images_directory');
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Retrieve or create the Images entity associated with the user
        $userImages = $user->getImage();
        if (!$userImages) {
            $userImages = new Images();
            $userImages->setUser($user);
        }

        // List of image field names to check
        $imageFields = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'];
        foreach ($imageFields as $field) {
            if ($files->has($field)) {
                $file = $files->get($field);

                // Validate uploaded file
                if (!$file->isValid()) {
                    return new JsonResponse(['message' => 'invalid-file-' . $field], Response::HTTP_BAD_REQUEST);
                }

                // Generate unique file name
                $fileName = md5(uniqid()) . '.' . $file->getClientOriginalExtension();

                // Move the file to the upload directory and set its path
                try {
                    $file->move($uploadDir, $fileName);

                    // Dynamically call the setter method for the image field
                    $setter = 'set' . ucfirst($field);
                    $userImages->$setter($fileName);
                } catch (\Exception $e) {
                    return new JsonResponse([
                        'message' => 'error-saving-file',
                        'error' => $e->getMessage()
                    ], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
        }

        // Persist the Images entity and associate it with the user
        $user->setImage($userImages);
        $entityManager->persist($userImages);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'images-uploaded-successfully'], Response::HTTP_OK);
    }
}
