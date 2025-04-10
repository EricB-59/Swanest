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
    #[Route('', name: 'app_feed_back', methods: ['POST'])]
    public function addFeedback(EntityManagerInterface $entityManager, Request $request)
    {
        $data = json_decode($request->getContent(), true);

        $email = $data["email"];
        $subject = $data["subject"];
        $message = $data["message"];



        if (empty($email) || empty($subject) || empty($message)) {
            return new JsonResponse('Feedback incorrect, no empty fields!', Response::HTTP_BAD_REQUEST);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse('Invalid email, bad format', Response::HTTP_BAD_REQUEST);
        }

        if (strlen($subject) > 50) {
            return new JsonResponse('Invalid subject, too long', Response::HTTP_BAD_REQUEST);
        }

        if (strlen($message) > 255) {
            return new JsonResponse('Invalid message, too long', Response::HTTP_BAD_REQUEST);
        }


        $feedback = new FeedbackSupport();

        $feedback->setEmail($email);
        $feedback->setSubject($subject);
        $feedback->setMessage($message);

        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $feedback->setSubmittedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        $entityManager->persist($feedback);
        $entityManager->flush();

        return new JsonResponse('Feedback correct!', Response::HTTP_OK);
    }
}
