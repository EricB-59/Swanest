<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Entity\Chat;

#[Route('/chat', name: 'app_chat')]
final class ChatController extends AbstractController
{
    #[Route(path: '/chats/{id}', name: 'app_find_user', methods: ['GET'])]
    public function chatsByUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        $chatsData = [];
        foreach ($user->getChats() as $chat) {
            $otherUser = $chat->getUser2();

            // Si el usuario actual es user2, entonces necesitamos user1
            if ($otherUser->getId() === $user->getId()) {
                $otherUser = $chat->getUser1();
            }

            // Obtenemos el nombre del usuario (asumiendo que hay un profile con first_name)
            $userName = null;
            if ($otherUser->getProfile()) {
                $userName = $otherUser->getProfile()->getFirstName() . ' ' . $otherUser->getProfile()->getLastName();
            } else {
                $userName = $otherUser->getUsername(); // Fallback al username si no hay profile
            }

            // Agregamos la información al array
            $chatsData[] = [
                'chat_id' => $chat->getId(),
                'user_id' => $otherUser->getId(),
                'user_name' => $userName
            ];
        }

        return new JsonResponse($chatsData, Response::HTTP_OK);
    }
}
