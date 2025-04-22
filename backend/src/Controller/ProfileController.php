<?php

namespace App\Controller;

use App\Entity\Gender;
use App\Entity\Images;
use App\Entity\Label;
use App\Entity\UserLabel;
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

use function Symfony\Component\Clock\now;

#[Route('/profile', name: 'app_profile')]
final class ProfileController extends AbstractController
{
    #[Route(path: '', name: 'app_profile_create', methods: ['POST'],)]
    public function create(EntityManagerInterface $entityManager, Request $request)
    {
        $data = json_decode($request->getContent(), true);

        $userId = $data['user_id'];
        $firstName = $data["first_name"];
        $lastName = $data["last_name"];
        $bio = $data["bio"];
        $gender = $data["gender"];
        $birthDate = $data["birthdate"];
        $province = $data["province"];
        $images = $data['images'];
        $labels = $data['labels'];

        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id' => $gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['name' => $province]);
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
        $user = $entityManager->getRepository(User::class)->findOneBy(['id' => $userId]);

        // Check if user already has a profile
        $existingProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $user]);
        if ($existingProfile) {
            return new JsonResponse('User already has a profile', Response::HTTP_CONFLICT);
        }

        $newImages = new Images;
        $newImages->setUser($user);
        $newImages->setImage1($images['image_1']);
        $newImages->setImage2($images['image_2']);
        $newImages->setImage3($images['image_3']);
        $newImages->setImage4($images['image_4']);
        $newImages->setImage5($images['image_5']);
        $newImages->setUploadedAt(now());
        $user->setImage($newImages);

        $profile->setUser($user);
        $profile->setFirstName($firstName);
        $profile->setLastName($lastName);
        $profile->setBio($bio);
        $profile->setGender($newGender);
        $profile->setBirthdate($newBirthDate);
        $profile->setProvince($newProvince);

        $labelRepository = $entityManager->getRepository(Label::class);

        $newLabels = new UserLabel;

        $newLabels->setFirstLabel($labelRepository->findOneBy(['name' => $labels['first_label']['name']]));
        $newLabels->setSecondLabel($labelRepository->findOneBy(['name' => $labels['second_label']['name']]));
        $newLabels->setThirdLabel($labelRepository->findOneBy(['name' => $labels['third_label']['name']]));
        $newLabels->setFourthLabel($labelRepository->findOneBy(['name' => $labels['fourth_label']['name']]));
        $newLabels->setFifthLabel($labelRepository->findOneBy(['name' => $labels['fifth_label']['name']]));

        $profile->setLabels($newLabels);

        $dateTimeZone = new DateTimeZone("Europe/Madrid");
        $profile->setCreatedAt(new DateTimeImmutable(timezone: $dateTimeZone));
        $profile->setUpdatedAt(new DateTimeImmutable(timezone: $dateTimeZone));

        $entityManager->persist($profile);
        $entityManager->flush();

        return new JsonResponse('Profile Created succesfully!', Response::HTTP_OK);
    }

    #[Route(path: '/{id}', name: 'app_profile_get', methods: ['GET'])]
    public function getProfile(int $id, EntityManagerInterface $entityManager)
    {
        $profileRepository = $entityManager->getRepository(Profile::class);
        $profile = $profileRepository->find($id);

        if (!$profile) {
            return new JsonResponse(
                ['message' => 'profile-not-found'],
                Response::HTTP_NOT_FOUND
            );
        }

        return new JsonResponse($profile->toArray());
    }

    #[Route(path: '/{id}', name: 'app_profile_update', methods: ['PUT'],)]
    public function updateProfile(int $id, EntityManagerInterface $entityManager, Request $request)
    {
        $data = json_decode($request->getContent(), true);

        $bio = $data["bio"];
        $province = $data["province"];
        $gender = $data["gender"];
        $labels = $data["labels"];
        $images = $data["images"];

        $newGender = $entityManager->getRepository(Gender::class)->findOneBy(['id' => $gender]);
        $newProvince = $entityManager->getRepository(Province::class)->findOneBy(['id' => $province]);

        $updateProfile = $entityManager->getRepository(Profile::class)->findOneBy(['user' => $id]);
        $updateUser = $entityManager->getRepository(User::class)->find($id);

        if (!$updateProfile) {
            return new JsonResponse('profile-not-found', Response::HTTP_BAD_REQUEST);
        }

        if (!$updateUser) {
            return new JsonResponse('user-not-found', Response::HTTP_BAD_REQUEST);
        }

        if (empty($bio) || empty($gender) || empty($labels) || empty($province) || empty($images)) {
            return new JsonResponse('empty-fields', Response::HTTP_BAD_REQUEST);
        }

        if (empty($images['image_1']) || empty($images['image_2'])) {
            return new JsonResponse('empty-mandatory-fields', Response::HTTP_BAD_REQUEST);
        }

        $newImages = $updateUser->getImage();
        if ($newImages) {
            $newImages->setImage1($images['image_1']);
            $newImages->setImage2($images['image_2']);
            $newImages->setImage3($images['image_3']);
            $newImages->setImage4($images['image_4']);
            $newImages->setImage5($images['image_5']);
            $newImages->setUploadedAt(now());
            $updateUser->setImage($newImages);
        }

        $newLabels = $updateProfile->getLabels();
        if ($newLabels) {
            $firstLabel = $newLabels->getFirstLabel();
            $firstLabel->setId($labels['first_label']['id']);
            $firstLabel->setName($labels['first_label']['name']);

            $secondLabel = $newLabels->getSecondLabel();
            $secondLabel->setId($labels['second_label']['id']);
            $secondLabel->setName($labels['second_label']['name']);

            $thirdLabel = $newLabels->getThirdLabel();
            $thirdLabel->setId($labels['third_label']['id']);
            $thirdLabel->setName($labels['third_label']['name']);

            $fourthLabel = $newLabels->getFourthLabel();
            $fourthLabel->setId($labels['fourth_label']['id']);
            $fourthLabel->setName($labels['fourth_label']['name']);

            $fifthLabel = $newLabels->getFifthLabel();
            $fifthLabel->setId($labels['fifth_label']['id']);
            $fifthLabel->setName($labels['fifth_label']['name']);

            $newLabels->setFirstLabel($firstLabel);
            $newLabels->setSecondLabel($secondLabel);
            $newLabels->setThirdLabel($thirdLabel);
            $newLabels->setFourthLabel($fourthLabel);
            $newLabels->setFifthLabel($fifthLabel);
            $updateProfile->setLabels($newLabels);
        }

        $updateProfile->setBio($bio);
        $updateProfile->setGender($newGender);
        $updateProfile->setProvince($newProvince);
        $updateProfile->setUpdatedAt(now());

        $entityManager->flush();

        return new JsonResponse($updateUser->toArray(), Response::HTTP_OK);
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
