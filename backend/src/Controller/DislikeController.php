<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DislikeController extends AbstractController
{
    #[Route('/dislike', name: 'app_dislike')]
    public function index(): Response
    {
        return $this->render('dislike/index.html.twig', [
            'controller_name' => 'DislikeController',
        ]);
    }
}
