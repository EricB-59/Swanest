<?php

namespace App\Controller;

use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/profile', name: 'app_profile')]
final class ProfileController extends AbstractController
{
    #[Route('/update', name:'app_profile_update')]
    public function updateProfile(int $id, EntityManagerInterface $entityManager, Request $request){

        $data = json_decode($request->getContent(), true);

        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $bio = $data["bio"];
        $gender = $data["gender"];
        $birthDate = $data["birthdate"];
        $province = $data["province"];

        $profileToChange = $entityManager->getRepository(Profile::class)->find(['user_id' => $id]);

        if($profileToChange == null){
            return new JsonResponse('Profile Not found', Response::HTTP_BAD_REQUEST);
        }else{
            if(!empty( $profileFirstName) || !empty($profileLastName) || !empty($profileBio) || !empty($profileGender) || !empty($profileBirthDate) || !empty($profileProvince)){

                $profileToChange->setFirstName($firstName);
                $profileToChange->setLastName($lastName);
                $profileToChange->setBio($bio);
                $profileToChange->setGender($gender);
                $profileToChange->setBirthdate($birthDate);
                $profileToChange->setProvince($province);

                $entityManager->flush();
            }
        }
    }
}
