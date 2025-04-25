<?php

namespace App\Controller;

use App\Entity\Dislike;
use App\Entity\Like;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/dislike', name: 'app_like')]
final class DislikeController extends AbstractController
{
    #[Route(path: '/{user_id}', name: 'app_add_dislike', methods: ['POST'])]
    public function addDislike(int $user_id, Request $request, EntityManagerInterface $entityManager)
    {
        $data = $request->toArray();
        $disliked_id = $data['disliked_id'] ?? null;

        $disliker = $entityManager->getRepository(User::class)->find($user_id);
        $disliked = $entityManager->getRepository(User::class)->find($disliked_id);

        if (!$disliker || !$disliked){
            return new JsonResponse('user not found', Response::HTTP_NOT_FOUND);
        }

        $existingLike = $entityManager->getRepository(Like::class)->findOneBy([
            'liker' => $disliker,
            'liked' => $disliked
        ]);

        if ($existingLike)
            $entityManager->remove($existingLike);

        $existingDislike = $entityManager->getRepository(Dislike::class)->findOneBy([
            'disliker' => $disliker,
            'disliked' => $disliked,
        ]);

        if ($existingDislike)
            return new JsonResponse('dislike already exist', Response::HTTP_OK);

        $dislike = new Dislike();
        $dislike->setDisliker($disliker);
        $dislike->setDisliked($disliked);
        $dislike->setDislikedAt(new \DateTimeImmutable());
        $entityManager->persist($dislike);
        $entityManager->flush();

        return new JsonResponse('dislike successfully added', Response::HTTP_OK);
    }
}
