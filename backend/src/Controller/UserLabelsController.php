<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Label;
use Symfony\Component\HttpFoundation\JsonResponse;

#[Route('/labels', name: 'app_user_labels')]

final class UserLabelsController extends AbstractController
{
    #[Route(path: '', name: 'get_labels', methods: ['GET'],)]
    public function getLabels(EntityManagerInterface $entityManager)
    {

        $labels = $entityManager->getRepository(Label::class)->findAll();

        $out = [];

        foreach ($labels as $label) {
            array_push($out, ["id" => $label->getId(), "name" => $label->getName()]);
        }

        return new JsonResponse(json_encode($out));
    }
}
