<?php

namespace App\Controller;

use App\Entity\Matche;
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
    public function getMatchProfiles(int $id, Request $request, EntityManagerInterface $entityManager)
    {
        $minAge = $request->get('minAge');
        $maxAge = $request->get('maxAge');
        $gender = $request->query->get('gender');
        $province = $request->query->get('province');

        $profileRepository = $entityManager->getRepository(Profile::class);
        $profiles = $profileRepository->findProfiles($id, $minAge, $maxAge, $gender, $province);

        $userRepository = $entityManager->getRepository(User::class);


        $profilesArray = [];
        foreach ($profiles as $profile) {
            $profilesArray[] = [$profile->toArray(), ($userRepository->find($profile->getUser()->getId())->getImage()->toArray())];
        }

        if (!$profiles) {
            return new JsonResponse('Profiles not found.', Response::HTTP_NOT_FOUND);
        }

        return new JsonResponse($profilesArray, Response::HTTP_OK);
    }

    #[Route('/{id}', 'app_match_profiles', methods: ['GET'])]
    public function getMatchCount(int $id, EntityManagerInterface $entityManager)
    {
        $matchRepository = $entityManager->getRepository(Matche::class);
        $matchs = $matchRepository->findBy(['user1' => $id]);

        return new JsonResponse(count($matchs), Response::HTTP_OK);
    }
}
