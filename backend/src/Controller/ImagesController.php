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
    #[Route('/{id}', name: 'app_images', methods: ['GET'])]
    public function getImages (int $id, EntityManagerInterface $entityManager): Response {
        $imagesRepository = $entityManager->getRepository(Images::class);
        $images = $imagesRepository->findOneBy(['user' => $id]);
        return new JsonResponse($images->toArray(),Response::HTTP_OK );
    }
    #[Route('/{id}', name: 'app_images_upload', methods: ['POST'])]
    public function uploadImages(int $id, Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $entityManager->getRepository(User::class)->find($id);
        
        if (!$user) {
            return new JsonResponse(['message' => 'user-not-found'], Response::HTTP_NOT_FOUND);
        }
        
        // Verificar si hay archivos en la solicitud
        $files = $request->files;
        
        if ($files->count() === 0) {
            return new JsonResponse(['message' => 'no-files-uploaded'], Response::HTTP_BAD_REQUEST);
        }
        
        // Definir el directorio de subida
        $uploadDir = $this->getParameter('images_directory');
        
        // Asegurarse de que el directorio existe
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        // Obtener o crear la entidad Images para el usuario
        $userImages = $user->getImage();
        if (!$userImages) {
            $userImages = new Images();
            $userImages->setUser($user);
        }
        
        // Procesar cada imagen
        $imageFields = ['image_1', 'image_2', 'image_3', 'image_4', 'image_5'];
        foreach ($imageFields as $field) {
            if ($files->has($field)) {
                $file = $files->get($field);
                
                // Validar el archivo
                if (!$file->isValid()) {
                    return new JsonResponse(['message' => 'invalid-file-' . $field], Response::HTTP_BAD_REQUEST);
                }
                
                // Generar un nombre único para el archivo
                $fileName = md5(uniqid()) . '.' . $file->getClientOriginalExtension();
                
                // Mover el archivo al directorio de carga
                try {
                    $file->move($uploadDir, $fileName);
                    
                    // Guardar la ruta del archivo en la entidad Images
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
        
        // Guardar la entidad Images y asociarla al usuario
        $user->setImage($userImages);
        $entityManager->persist($userImages);
        $entityManager->persist($user);
        $entityManager->flush();
        
        return new JsonResponse(['message' => 'images-uploaded-successfully'], Response::HTTP_OK);
    }
}
