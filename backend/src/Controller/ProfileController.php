<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Profile;
use App\Entity\User;
use App\Entity\Province;
use Composer\Pcre\Regex;
use DateTime;
use DateTimeImmutable;
use DateTimeZone;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/profile', name: 'app_profile')]
final class ProfileController extends AbstractController
{
    #[Route(path: '/update/{id}', name:'app_profile_update', methods: ['PUT'],)]
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

        $updateProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $id]);

        if($updateProfile == null){
            return new JsonResponse('Profile Not found', Response::HTTP_BAD_REQUEST);
        }
        
        if(empty( $firstName) || empty($lastName) || empty($bio) || empty($gender) || empty($birthDate) || empty($province)){
            return new JsonResponse('Update not correct!', Response::HTTP_BAD_REQUEST);
        }

        $updateProfile->setFirstName($firstName);
        $updateProfile->setLastName($lastName);
        $updateProfile->setBio($bio);
        $updateProfile->setGender($newGender);
        $updateProfile->setBirthdate($newBirthDate);
        $updateProfile->setProvince($newProvince);

        $entityManager->flush();

        return new JsonResponse('Update correct!', Response::HTTP_OK);
    }


    #[Route(path: '/createProfile/{id}', name:'app_profile_create', methods: ['POST'],)]
    public function personalInfo(EntityManagerInterface $entityManager, Request $request){

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

        if(empty( $firstName) || empty($lastName) || empty($bio) || empty($gender) || empty($birthDate) || empty($province)){
            return new JsonResponse('No empty fields!', Response::HTTP_BAD_REQUEST);
        }

        if(preg_match('/^[a-zA-Z]+$/', $firstName)){
            return new JsonResponse('Only allow letters in the name', Response::HTTP_BAD_REQUEST);
        }

        if(preg_match('/^[a-zA-Z]+$/', $lastName)){
            return new JsonResponse('Only allow letters in the surname', Response::HTTP_BAD_REQUEST);
        }

        if(strlen($bio) >255){
            return new JsonResponse('Bio too long', Response::HTTP_BAD_REQUEST);
        }

        $profile = new Profile();

        $profile->setFirstName($firstName);
        $profile->setLastName($lastName);
        $profile->setBio($bio);
        $profile->setGender($newGender);
        $profile->setBirthdate($newBirthDate);
        $profile->setProvince($newProvince);
        
        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $user->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));
        
    }
}
