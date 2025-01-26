<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/user', name: 'app_user')]
final class UserController extends AbstractController
{
    #[Route('/test', name: 'test')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'App_user(Symfony) working!',
        ]);
    }
}
