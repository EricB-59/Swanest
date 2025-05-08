<?php

namespace App\Controller;

use DateTimeImmutable;
use DateTimeZone;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\FeedbackSupport;

#[Route('/feedback', name: 'app_feed_back')]
final class FeedBackController extends AbstractController
{
    /**
     * Submit user feedback to the system.
     *
     * This endpoint allows users to submit feedback by:
     * 1. Parsing email, subject, and message from the JSON request body
     * 2. Validating that all fields are present and properly formatted
     * 3. Enforcing limits on subject and message length
     * 4. Creating a new FeedbackSupport entity with a timestamp (Europe/Madrid timezone)
     * 5. Saving the feedback to the database
     *
     * @param EntityManagerInterface $entityManager Doctrine entity manager for database operations
     * @param Request $request HTTP request containing feedback data in JSON format
     *
     * @return JsonResponse Returns the result of the feedback submission
     *
     * HTTP Status Codes:
     * - 200 OK: Feedback successfully submitted
     * - 400 Bad Request: Missing fields, invalid email format, or length violations
     */
    #[Route('', name: 'app_feed_back', methods: ['POST'])]
    public function addFeedback(EntityManagerInterface $entityManager, Request $request)
    {
        // Decode JSON content from request body
        $data = json_decode($request->getContent(), true);

        $email = $data["email"];
        $subject = $data["subject"];
        $message = $data["message"];

        // Validate non-empty fields
        if (empty($email) || empty($subject) || empty($message)) {
            return new JsonResponse('Feedback incorrect, no empty fields!', Response::HTTP_BAD_REQUEST);
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse('Invalid email, bad format', Response::HTTP_BAD_REQUEST);
        }

        // Enforce subject length limit
        if (strlen($subject) > 50) {
            return new JsonResponse('Invalid subject, too long', Response::HTTP_BAD_REQUEST);
        }

        // Enforce message length limit
        if (strlen($message) > 255) {
            return new JsonResponse('Invalid message, too long', Response::HTTP_BAD_REQUEST);
        }

        // Create new FeedbackSupport entity
        $feedback = new FeedbackSupport();
        $feedback->setEmail($email);
        $feedback->setSubject($subject);
        $feedback->setMessage($message);

        // Set submission timestamp with Europe/Madrid timezone
        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $feedback->setSubmittedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        // Save feedback to the database
        $entityManager->persist($feedback);
        $entityManager->flush();

        // Return success response
        return new JsonResponse('Feedback correct!', Response::HTTP_OK);
    }
}
