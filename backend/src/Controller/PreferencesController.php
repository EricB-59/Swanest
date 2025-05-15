<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Preference;
use App\Entity\Province;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

#[Route('/preferences', name: 'app_preferences')]
final class PreferencesController extends AbstractController
{
    #[Route('', name: 'app_create_preferences', methods: ['POST'])]
    public function createPreferencesForUser(EntityManagerInterface $entityManager, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $userId = $data['user_id'];
        $province = $data['province'];
        $genre = $data['genre'];
        $birtdate = $data['birthdate'];

        if (empty($userId) || empty($province) || empty($genre) || empty($birtdate)) {
            return new JsonResponse('empty-fields', Response::HTTP_BAD_REQUEST);
        }

        $repositoryUsers = $entityManager->getRepository(User::class);
        $user = $repositoryUsers->find($userId);

        if (!$user) {
            return new JsonResponse('user-not-found', Response::HTTP_NOT_FOUND);
        }

        $repositoryProvince = $entityManager->getRepository(Province::class);
        $province = $repositoryProvince->findOneBy(['name' => $province]);

        $repositoryGender = $entityManager->getRepository(Gender::class);
        $gender = $repositoryGender->find($genre);

        $actualYear = (int) date("Y");
        $year = explode("-", $birtdate);
        $profileYear = (int) $year[0];
        $ageProfile = $actualYear - $profileYear;

        $preferences = new Preference();
        $preferences->setUser($user);
        $preferences->setAgeMin($ageProfile);
        $preferences->setAgeMax($ageProfile + 5);
        $preferences->setProvince($province);
        $preferences->setGender($gender);

        $entityManager->persist($preferences);
        $entityManager->flush();

        return new JsonResponse();
    }

    #[Route('/update/{id}', name: 'app_update_preferences', methods: ['PUT'])]
    public function updatePreferences(int $id, EntityManagerInterface $entityManager, Request $request) {
        try{
            $data = $request->toArray();
            
            $provinceName = $data['province'] ?? null;
            $genderName = $data['gender'];
            $minAge = $data['minAge'];
            $maxAge = $data['maxAge'];
            
            
            $preferenceRepository = $entityManager->getRepository(Preference::class);
            $preference = $preferenceRepository->findOneBy(["user" => $id]);
            
            $preference->setAgeMin($minAge);
            $preference->setAgeMax($maxAge);
    
            $genderRepository = $entityManager->getRepository(Gender::class);
            $gender = $genderRepository->findOneBy(['name' => $genderName]);
            
            if (!$gender) {
                return new JsonResponse(['success' => false, 'message' => 'Preferences not found for user'], Response::HTTP_NOT_FOUND);
            }
            
            $preference->setGender($gender);
            
            if (!empty($provinceName)) {
                $provinceRepository = $entityManager->getRepository(Province::class);
                $province = $provinceRepository->findOneBy(['name' => $provinceName]);
                
                if (!$province) {
                    return new JsonResponse(['success' => false, 'message' => 'Invalid province selection'], Response::HTTP_BAD_REQUEST);
                }
                
                $preference->setProvince($province);
            } else {
                $preference->setProvince(null);
            }
            
            $entityManager->flush();
            return new JsonResponse(['success' => true, 'message' => 'Preferences updated successfully'], Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'app_get_preferences', methods: ['GET'])]
    public function getPreferences(int $id, EntityManagerInterface $entityManager){
        try {
            $preferencesRepository = $entityManager->getRepository(Preference::class);
            $preferences = $preferencesRepository->findOneBy(['user' => $id]);
            if (!$preferences) {
                return new JsonResponse(['error' => 'preferences not found'], Response::HTTP_NOT_FOUND);
            } else {
                $preferencesdata = $preferences->toArray();
            }
            return new JsonResponse($preferencesdata, Response::HTTP_OK);
        }catch(\Exception $e){
            return new JsonResponse(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
