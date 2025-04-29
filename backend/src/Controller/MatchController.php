<?php

namespace App\Controller;

use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/match', name: 'app_match')]
final class MatchController extends AbstractController
{
    #[Route('/profiles/{id}', 'app_match_profiles', methods: ['GET'])]
    public function getMatchProfiles(int $id, Request $request, EntityManagerInterface $entityManager)
    {
        $minAge = $request->get('minAge');
        $maxAge = $request->get('maxAge');
        $gender = $request->query->get('gender');
        $province = $request->query->get('province');

        $profileRepository = $entityManager->getRepository(Profile::class);
        $profiles = $profileRepository->findProfiles($id, $minAge, $maxAge, $gender, $province);

        if (!$profiles) {
            return new JsonResponse('Profiles not found', Response::HTTP_NOT_FOUND);
        }

        $profilesArray = [];
        foreach ($profiles as $profile) {
            $profilesArray[] = $profile->toArray();
        }

        return new JsonResponse($profilesArray, Response::HTTP_OK);
    }
}
