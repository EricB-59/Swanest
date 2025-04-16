<?php

namespace App\Controller;

use App\Entity\Dislike;
use App\Entity\Like;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/like', name: 'app_like')]
final class LikeController extends AbstractController 
{
    #[Route(path: '/{user_id}', name: 'app_add_like', methods: ['POST'])]
    public function addLike(int $user_id, Request $request, EntityManagerInterface $entityManager)
    {
        $data = $request->toArray();
        $liked_id = $data['liked_id'] ?? null;

        $liker = $entityManager->getRepository(User::class)->find($user_id);
        $liked = $entityManager->getRepository(User::class)->find($liked_id);

        if (!$liker || !$liked)
            return new JsonResponse('user not found', Response::HTTP_NOT_FOUND);

        $existingDislike = $entityManager->getRepository(Dislike::class)->findOneBy([
            'disliker' => $liker,
            'disliked' => $liked,
        ]);

        if($existingDislike)
            $entityManager->remove($existingDislike);

        $existingLike = $entityManager->getRepository(Like::class)->findOneBy([
            'liker' => $liker,
            'liked' => $liked,
        ]);

        if ($existingLike)
            return new JsonResponse('like already exist', Response::HTTP_OK);

        $like = new Like();
        $like->setLiker($liker);
        $like->setLiked($liked);
        $like->setLikedAt(new \DateTimeImmutable());
        $entityManager->persist($like);
        $entityManager->flush();

        return new JsonResponse('like successfully added', Response::HTTP_OK);
    }
}
