<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Profile;
use App\Entity\User;
use App\Entity\Province;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/profile', name: 'app_profile')]
final class ProfileController extends AbstractController
{
    #[Route('/update/{id}', name:'app_profile_update', methods: ['PUT'],)]
    public function updateProfile(int $id, EntityManagerInterface $entityManager, Request $request){

        $data = json_decode($request->getContent(), true);

        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $bio = $data["bio"];
        $gender = $data["gender"];
        $birthDate = $data["birthdate"];
        $province = $data["province"];

        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id'=>$gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['id'=>$province]);
        $newBirthDate = new DateTime($birthDate, null);

        $newProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $id]);

        if($newProfile == null){
            return new JsonResponse('Profile Not found', Response::HTTP_BAD_REQUEST);
        }
        
        if(empty( $firstName) || empty($lastName) || empty($bio) || empty($gender) || empty($birthDate) || empty($province)){
            return new JsonResponse('Update not correct!', Response::HTTP_BAD_REQUEST);
        }

        $newProfile->setFirstName($firstName);
        $newProfile->setLastName($lastName);
        $newProfile->setBio($bio);
        $newProfile->setGender($newGender);
        $newProfile->setBirthdate($newBirthDate);
        $newProfile->setProvince($newProvince);

        $entityManager->flush();

        return new JsonResponse('Update correct!', Response::HTTP_OK);
    }
}
