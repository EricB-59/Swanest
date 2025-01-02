<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/user', name: 'app_user', methods: ['GET'])]
    public function index(): JsonResponse
    {
        return $this->json(['id' => 1, 'name' => 'John Doe']);
    }
}
