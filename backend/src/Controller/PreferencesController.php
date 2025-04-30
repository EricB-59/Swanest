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
}
