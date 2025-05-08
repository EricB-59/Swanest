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

#[Route('/chat', name: 'app_chat')]
final class ChatController extends AbstractController
{
    /**
     * Retrieve all chat conversations for a specific user.
     *
     * This endpoint provides a comprehensive list of all chat conversations by:
     * 1. Finding the specified user by ID
     * 2. Retrieving all associated chat conversations
     * 3. For each chat:
     *    - Identifying the other participant in the conversation
     *    - Retrieving their profile image and name information
     *    - Finding the most recent message with its timestamp
     *    - Counting unread messages for notification purposes
     * 4. Formatting the data for client consumption
     *
     * @param int $id The unique identifier of the user whose chats should be retrieved
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns array of chat data or error message
     *
     * HTTP Status Codes:
     * - 200 OK: Chats successfully retrieved, returns chat conversation data
     * - 404 Not Found: User with specified ID does not exist
     */
    #[Route(path: '/{id}', name: 'app_find_user', methods: ['GET'])]
    public function chatsByUser(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Find the user in the database
        $userRepository = $entityManager->getRepository(User::class);
        $user = $userRepository->find($id);

        // Check if user exists
        if (!$user) {
            return new JsonResponse(
                ['message' => 'User not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        // Array to store formatted chat data
        $chatsData = [];

        // Process each chat associated with the user
        foreach ($user->getChats() as $chat) {
            // Determine who the other user in the conversation is
            $otherUser = $chat->getUser2();
            $otherUserImg = $chat->getUser2()->getImage()->getImage1();

            // If the "other user" is actually the current user, switch to the actual other user
            if ($otherUser->getId() === $user->getId()) {
                $otherUser = $chat->getUser1();
                $otherUserImg = $chat->getUser1()->getImage()->getImage1();
            }

            // Get name from profile or fall back to username
            $userName = null;
            if ($otherUser->getProfile()) {
                $userName = $otherUser->getProfile()->getFirstName() . ' ' . $otherUser->getProfile()->getLastName();
            } else {
                $userName = $otherUser->getUsername(); // Fallback to username if no profile exists
            }

            // Get the most recent message in the conversation
            $messageRepository = $entityManager->getRepository(Message::class);
            $messages = $messageRepository->findOneBy(['chat' => $chat->getId()], ['sent_at' => 'DESC']);

            // Count unread messages for notification badges
            $countMessagesNoRead = $messageRepository->count(['receiver' => $user->getId(), 'is_read' => false]);

            // Set default values for last message information
            $lastMessage = 'No hay mensajes';
            $hourLastMessage = '-';

            // Extract message content and timestamp if a message exists
            if ($messages !== null) {
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

            // Format the chat data for this conversation
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

        // Return all chat conversation data
        return new JsonResponse($chatsData, Response::HTTP_OK);
    }

    /**
     * Retrieve messages between two users and mark them as read.
     *
     * This endpoint handles message retrieval by:
     * 1. Finding all messages exchanged between the specified users
     * 2. Marking as "read" any unread messages where user1 is the receiver
     * 3. Converting message entities to a format suitable for the client
     * 4. Saving the read status changes to the database
     *
     * The function automatically updates the read status of messages as they're
     * viewed, ensuring accurate unread counts for notification purposes.
     *
     * @param int $user1 ID of the first user (typically the current user)
     * @param int $user2 ID of the second user (conversation partner)
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns array of message data
     *
     * HTTP Status Codes:
     * - 200 OK: Messages successfully retrieved and read status updated
     */
    #[Route(path: '/messages/{user1}/{user2}', name: 'app_find_messages', methods: ['GET'])]
    public function messageByChat(int $user1, int $user2, EntityManagerInterface $entityManager)
    {
        // Find all messages between the two users
        $messageRepository = $entityManager->getRepository(Message::class);
        $messages = $messageRepository->findBy(
            criteria: ['sender' => [$user1, $user2], 'receiver' => [$user1, $user2]],
            orderBy: ['sent_at' => 'ASC']
        );

        // Array to store formatted message data
        $messagesData = [];

        // Process each message
        foreach ($messages as $message) {
            // Mark messages as read if user1 is the receiver and message is unread
            if ($message->getReceiver()->getId() === $user1 && !$message->isRead()) {
                $message->setIsRead(true);
            }

            // Add formatted message data to result array
            array_push($messagesData, $message->toArray());
        }

        // Save the read status changes to the database
        $entityManager->flush();

        // Return all message data
        return new JsonResponse($messagesData, Response::HTTP_OK);
    }

    /**
     * Create a new message between two users.
     *
     * This endpoint handles message creation by:
     * 1. Validating required message fields (sender, receiver, content)
     * 2. Finding the corresponding chat thread between the users
     * 3. Creating a new message entity with appropriate metadata
     * 4. Setting the initial read status to unread
     * 5. Adding a timestamp with Europe/Madrid timezone
     * 6. Saving the message to the database
     *
     * @param Request $request Request containing message data in JSON format
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns confirmation of message creation or error
     *
     * HTTP Status Codes:
     * - 200 OK: Message successfully created
     * - 400 Bad Request: Missing required fields
     */
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

        // Validate required fields
        if (empty($sender_id) || empty($receiver_id) || empty($content)) {
            return new JsonResponse('empty-fields', Response::HTTP_BAD_REQUEST);
        }

        // Create new message entity
        $message = new Message();

        // Find the chat thread between sender and receiver
        $chat = $entityManager->getRepository(Chat::class)->findOneBy(['user1' => $sender_id, 'user2' => $receiver_id]);
        $message->setChat($chat);

        // Set sender and receiver references
        $sender = $entityManager->getRepository(User::class)->find($sender_id);
        $message->setSender($sender);

        $receiver = $entityManager->getRepository(User::class)->find($receiver_id);
        $message->setReceiver($receiver);

        // Set message content
        $message->setContent($content);

        // Set initial read status to unread
        $message->setIsRead(false);

        // Set timestamp with Madrid timezone
        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $message->setSentAt(new DateTimeImmutable(timezone: $dateTimeZone));

        // Save to database
        $entityManager->persist($message);
        $entityManager->flush();

        // Return success response
        return new JsonResponse('message_created', Response::HTTP_OK);
    }

    /**
     * Get the count of unread messages for a specific user.
     *
     * This endpoint retrieves the number of unread messages received by a user.
     * 
     * Process overview:
     * 1. Fetch messages where the receiver matches the given ID and is_read is false
     * 2. Count the number of such messages
     * 3. Return the count as a JSON response
     *
     * @param int $id ID of the user whose unread messages are being counted
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     *
     * @return JsonResponse Returns the count of unread messages
     *
     * HTTP Status Codes:
     * - 200 OK: Successfully retrieved unread message count
     */
    #[Route(path: '/messagesRead/{id}', name: 'app_messages_no_read', methods: ['GET'])]
    public function messagesNoRead(
        int $id,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Retrieve message repository
        $messageRepository = $entityManager->getRepository(Message::class);

        // Find messages where receiver is the given user ID and the message is not read
        $messagesNoRead = $messageRepository->findBy([
            'receiver' => $id,
            'is_read' => false
        ]);

        // Return the count of unread messages in a JSON response
        return new JsonResponse(['count' => count($messagesNoRead)]);
    }
}
