<?php

namespace App\Controller;

use App\Entity\Matche;
use App\Entity\Preference;
use App\Entity\Profile;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Query\Expr\Math;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/match', name: 'app_match')]
final class MatchController extends AbstractController
{
    #[Route('/profiles/{id}', 'app_match_profiles', methods: ['GET'])]
    public function getMatchProfiles(int $id, EntityManagerInterface $entityManager)
    {
        // Obtenemos el repositorio de preferencias y buscamos las del usuario actual
        $preferencesRepository = $entityManager->getRepository(Preference::class);
        $userPreferences = $preferencesRepository->findOneBy(['user' => $id]);

        // Si no tiene preferencias, usamos valores predeterminados
        if (!$userPreferences) {
            $minAge = null;
            $maxAge = null;
            $gender = null;
            $province = null;
        } else {
            // Usamos las preferencias guardadas del usuario
            $minAge = $userPreferences->getAgeMin();
            $maxAge = $userPreferences->getAgeMax();

            // Obtenemos el nombre del género preferido
            $gender = $userPreferences->getGender()->getName();

            // Obtenemos el nombre de la provincia preferida
            $province = $userPreferences->getProvince()->getName();
        }

        // Buscamos perfiles que coincidan con las preferencias
        $profileRepository = $entityManager->getRepository(Profile::class);
        $profiles = $profileRepository->findProfiles(
            $id,
            $minAge,
            $maxAge,
            $gender,
            $province
        );        
        // Preparamos la respuesta con los perfiles y sus imágenes
        $userRepository = $entityManager->getRepository(User::class);
        $profilesArray = [];

        foreach ($profiles as $profile) {
            $user = $userRepository->find($profile->getUser()->getId());
            $image = $user->getImage();

            $profilesArray[] = [
                $profile->toArray(),
                ($image ? $image->toArray() : [])
            ];
        }

        if (empty($profiles)) {
            return new JsonResponse('Profiles not found.', Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($profilesArray, Response::HTTP_OK);
    }

    #[Route('/{id}', 'app_count_profiles', methods: ['GET'])]
    public function getMatchCount(int $id, EntityManagerInterface $entityManager)
    {
        $matchRepository = $entityManager->getRepository(Matche::class);
        $matchs = $matchRepository->findBy(['user1' => $id]);

        return new JsonResponse(count($matchs), Response::HTTP_OK);
    }
}
