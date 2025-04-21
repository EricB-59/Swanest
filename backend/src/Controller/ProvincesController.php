<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Province;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route(path: '/provinces', name: 'app_provinces')]
final class ProvincesController extends AbstractController
{
    
    #[Route(path: '', name: 'app_provinces', methods: ['GET'])]
    public function getProvinces(EntityManagerInterface $entityManager)
    {

        $provinces = $entityManager->getRepository(Province::class)->findAll();

        $out = [];

        foreach ($provinces as $province) {
            array_push($out, ["id" => $province->getId(), "name" => $province->getName()]);
        }

        return new JsonResponse(json_encode($out));
    }
}
