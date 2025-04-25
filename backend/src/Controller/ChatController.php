<?php

namespace App\Controller;

use DateTimeImmutable;
use DateTimeZone;

use App\Entity\Chat;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Entity\User;
use App\Entity\Message;
use Symfony\Component\HttpFoundation\Request;

use function Symfony\Component\Clock\now;

#[Route('/chat', name: 'app_chat')]
final class ChatController extends AbstractController
{
    #[Route(path: '/{id}', name: 'app_find_user', methods: ['GET'])]
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
            $otherUserImg = $chat->getUser2()->getImage()->getImage1();

            // In case of the other user is the actual user
            if ($otherUser->getId() === $user->getId()) {
                $otherUser = $chat->getUser1();
                $otherUserImg = $chat->getUser1()->getImage()->getImage1();
            }

            $userName = null;
            if ($otherUser->getProfile()) {
                $userName = $otherUser->getProfile()->getFirstName() . ' ' . $otherUser->getProfile()->getLastName();
            } else {
                $userName = $otherUser->getUsername(); // Fallback al username si no hay profile
            }

            $messageRepository = $entityManager->getRepository(Message::class);
            $messages = $messageRepository->findOneBy(['chat' => $chat->getId()], ['sent_at' => 'DESC']);
            $countMessagesNoRead = $messageRepository->count(['receiver' => $user->getId(), 'is_read' => false]);

            $lastMessage = 'No hay mensajes';
            $hourLastMessage = '-';
            if ($messages !== null) {
                // Additional null check on getContent() result if needed
                $content = $messages->getContent();
                $hour = $messages->getSentAt();

                if ($content) {
                    $lastMessage = $content;
                }
                if ($hour) {
                    $convertedDate = $hour->format('H:i');
                    $hourLastMessage = $convertedDate;
                }
            }

            $chatsData[] = [
                'chat_id' => $chat->getId(),
                'user_id' => $otherUser->getId(),
                'user_name' => $userName,
                'last_message_content' => $lastMessage,
                'last_message_hour' => $hourLastMessage,
                'messages_no_read' => $countMessagesNoRead,
                'user_img' => $otherUserImg,
                'is_fixed' => $chat->isFixed()
            ];
        }

        return new JsonResponse($chatsData, Response::HTTP_OK);
    }

    #[Route(path: '/messages/{user1}/{user2}', name: 'app_find_messages', methods: ['GET'])]
    public function messageByChat(int $user1, int $user2, EntityManagerInterface $entityManager)
    {
        $messageRepository = $entityManager->getRepository(Message::class);
        $messages = $messageRepository->findBy(
            criteria: ['sender' => [$user1, $user2], 'receiver' => [$user1, $user2]],
            orderBy: ['sent_at' => 'ASC']
        );

        $messagesData = [];
        foreach ($messages as $message) {
            // If the receiver is user1, mark the message as read
            if ($message->getReceiver()->getId() === $user1 && !$message->isRead()) {
                $message->setIsRead(true);
            }

            array_push($messagesData, $message->toArray());
        }

        // Persist the changes to the database
        $entityManager->flush();

        return new JsonResponse($messagesData, Response::HTTP_OK);
    }

    #[Route(path: '', name: 'app_create_message', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $entityManager
    ) {
        // Parse JSON data from request body
        $data = json_decode($request->getContent(), true);
        $sender_id = $data['sender_id'];
        $receiver_id = $data['receiver_id'];
        $content = $data['content'];

        if (empty($sender_id) || empty($receiver_id) || empty($content)) {
            return new JsonResponse('empty-fields', Response::HTTP_BAD_REQUEST);
        }

        $message = new Message();

        $chat = $entityManager->getRepository(Chat::class)->findOneBy(['user1' => $sender_id, 'user2' => $receiver_id]);
        $message->setChat($chat);

        $sender = $entityManager->getRepository(User::class)->find($sender_id);
        $message->setSender($sender);

        $receiver = $entityManager->getRepository(User::class)->find($receiver_id);
        $message->setReceiver($receiver);

        $message->setContent($content);
        $message->setIsRead(false);

        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $message->setSentAt(new DateTimeImmutable(timezone: $dateTimeZone));

        $entityManager->persist($message);
        $entityManager->flush();

        return new JsonResponse('message_created', Response::HTTP_OK);
    }

    #[Route(path: '/messagesRead/{id}', name: 'app_messages_no_read', methods: ['GET'])]
    public function messagesNoRead(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $messageRepository = $entityManager->getRepository(Message::class);
        $messagesNoRead = $messageRepository->findBy(['receiver' => $id, 'is_read' => false]);

        return new JsonResponse(['count' => count($messagesNoRead)]);
    }
}
