<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Label;
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
    #[Route(path: '/getProfile/{id}', name: 'app_profile_get', methods: ['GET'])]
    public function getProfile(int $id, EntityManagerInterface $entityManager)
    {
        $profileRepository = $entityManager->getRepository(Profile::class);
        $profile = $profileRepository->findOneBy(['user' => $id]);

        if (!$profile) {
            return new JsonResponse(
                ['message' => 'Profile not found'],
                Response::HTTP_NOT_FOUND
            );
        }

        return new JsonResponse($profile->toArray());
    }

    #[Route(path: '/update/{id}', name: 'app_profile_update', methods: ['PUT'],)]
    public function updateProfile(int $id, EntityManagerInterface $entityManager, Request $request)
    {

        $data = json_decode($request->getContent(), true);

        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $bio = $data["bio"];
        $gender = $data["gender"];
        $birthDate = $data["birthdate"];
        $province = $data["province"];

        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id' => $gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['id' => $province]);
        $newBirthDate = new DateTime($birthDate, null);

        $updateProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $id]);

        if ($updateProfile == null) {
            return new JsonResponse('Profile Not found', Response::HTTP_BAD_REQUEST);
        }

        if (empty($firstName) || empty($lastName) || empty($bio) || empty($gender) || empty($birthDate) || empty($province)) {
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


    #[Route(path: '/create', name: 'app_profile_create', methods: ['POST'],)]
    public function personalInfo(EntityManagerInterface $entityManager, Request $request)
    {

        $data = json_decode($request->getContent(), true);

        $id = $data["id"];
        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $bio = $data["bio"];
        $gender = $data["gender"];
        $birthDate = $data["birthdate"];
        $province = $data["province"];

        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id' => $gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['id' => $province]);
        $newBirthDate = new DateTime($birthDate, null);

        if (empty($firstName) || empty($lastName) || empty($bio) || empty($gender) || empty($birthDate) || empty($province)) {
            return new JsonResponse('No empty fields!', Response::HTTP_BAD_REQUEST);
        }

        if (!preg_match('/^[a-zA-Z]+$/', $firstName)) {
            return new JsonResponse('Only allow letters in the name', Response::HTTP_BAD_REQUEST);
        }

        if (!preg_match('/^[a-zA-Z]+$/', $lastName)) {
            return new JsonResponse('Only allow letters in the surname', Response::HTTP_BAD_REQUEST);
        }

        if (strlen($bio) > 255) {
            return new JsonResponse('Bio too long', Response::HTTP_BAD_REQUEST);
        }


        $actualYear = (int) date("Y");

        $year = explode("-", $birthDate);
        $profileYear = (int) $year[0];

        if (($actualYear - $profileYear) < 18) {
            return new JsonResponse('Wrong age', Response::HTTP_BAD_REQUEST);
        }

        $profile = new Profile();
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $id]);

        $profile->setUser($user);
        $profile->setFirstName($firstName);
        $profile->setLastName($lastName);
        $profile->setBio($bio);
        $profile->setGender($newGender);
        $profile->setBirthdate($newBirthDate);
        $profile->setProvince($newProvince);

        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $profile->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));
        $profile->setUpdatedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        $entityManager->persist($profile);
        $entityManager->flush();

        return new JsonResponse('Profile Created succesfully!', Response::HTTP_OK);
    }

    #[Route(path: '/provinces', name: 'get_provinces', methods: ['GET'],)]
    public function getProvinces(EntityManagerInterface $entityManager)
    {

        $provinces = $entityManager->getRepository(Province::class)->findAll();

        $out = [];

        foreach ($provinces as $province) {
            array_push($out, ["id" => $province->getId(), "name" => $province->getName()]);
        }

        return new JsonResponse(json_encode($out));
    }

    #[Route(path: '/labels', name: 'get_labels', methods: ['GET'],)]
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
