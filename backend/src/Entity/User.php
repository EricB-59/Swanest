<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: "users")]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 25)]
    private ?string $username = null;

    #[ORM\Column(length: 50)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(type: "json")]
    private array $roles = [];

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Profile $profile = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Images $image = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Preference $preference = null;

    /**
     * @var Collection<int, Like>
     */
    #[ORM\OneToMany(targetEntity: Like::class, mappedBy: 'liker', orphanRemoval: true)]
    private Collection $likes;

    /**
     * @var Collection<int, Matche>
     */
    #[ORM\OneToMany(targetEntity: Matche::class, mappedBy: 'user1', orphanRemoval: true)]
    private Collection $matches;

    /**
     * @var Collection<int, Chat>
     */
    #[ORM\OneToMany(targetEntity: Chat::class, mappedBy: 'user1', orphanRemoval: true)]
    private Collection $chats;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'sender', orphanRemoval: true)]
    private Collection $messages;

    /**
     * @var Collection<int, BlockReport>
     */
    #[ORM\OneToMany(targetEntity: BlockReport::class, mappedBy: 'reporter', orphanRemoval: true)]
    private Collection $blockReports;

    /**
     * @var Collection<int, Dislike>
     */
    #[ORM\OneToMany(targetEntity: Dislike::class, mappedBy: 'disliker', orphanRemoval: true)]
    private Collection $dislikeGiven;

    /**
     * @var Collection<int, Dislike>
     */
    #[ORM\OneToMany(targetEntity: Dislike::class, mappedBy: 'disliked', orphanRemoval: true)]
    private Collection $dislikesReceived;

    public function __construct()
    {
        $this->likes = new ArrayCollection();
        $this->matches = new ArrayCollection();
        $this->chats = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->blockReports = new ArrayCollection();
        $this->dislikeGiven = new ArrayCollection();
        $this->dislikesReceived = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(?\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return array
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // garantizar que todos los usuarios tengan al menos ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param array $roles
     * @return $this
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * Método requerido por UserInterface
     */
    public function eraseCredentials(): void
    {
        // Si tienes algún campo temporal de contraseña, límpialo aquí
    }

    /**
     * Método requerido por UserInterface
     * Devuelve un identificador único para el usuario
     */
    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(Profile $profile): static
    {
        // set the owning side of the relation if necessary
        if ($profile->getUser() !== $this) {
            $profile->setUser($this);
        }

        $this->profile = $profile;

        return $this;
    }

    public function getImage(): ?Images
    {
        return $this->image;
    }

    public function setImage(Images $image): static
    {
        // set the owning side of the relation if necessary
        if ($image->getUser() !== $this) {
            $image->setUser($this);
        }

        $this->image = $image;

        return $this;
    }

    public function getPreference(): ?Preference
    {
        return $this->preference;
    }

    public function setPreference(Preference $preference): static
    {
        // set the owning side of the relation if necessary
        if ($preference->getUser() !== $this) {
            $preference->setUser($this);
        }

        $this->preference = $preference;

        return $this;
    }

    /**
     * @return Collection<int, Like>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(Like $like): static
    {
        if (!$this->likes->contains($like)) {
            $this->likes->add($like);
            $like->setLiker($this);
        }

        return $this;
    }

    public function removeLike(Like $like): static
    {
        if ($this->likes->removeElement($like)) {
            // set the owning side to null (unless already changed)
            if ($like->getLiker() === $this) {
                $like->setLiker(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Matche>
     */
    public function getMatches(): Collection
    {
        return $this->matches;
    }

    public function addMatch(Matche $match): static
    {
        if (!$this->matches->contains($match)) {
            $this->matches->add($match);
            $match->setUser1($this);
        }

        return $this;
    }

    public function removeMatch(Matche $match): static
    {
        if ($this->matches->removeElement($match)) {
            // set the owning side to null (unless already changed)
            if ($match->getUser1() === $this) {
                $match->setUser1(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Chat>
     */
    public function getChats(): Collection
    {
        return $this->chats;
    }

    public function addChat(Chat $chat): static
    {
        if (!$this->chats->contains($chat)) {
            $this->chats->add($chat);
            $chat->setUser1($this);
        }

        return $this;
    }

    public function removeChat(Chat $chat): static
    {
        if ($this->chats->removeElement($chat)) {
            // set the owning side to null (unless already changed)
            if ($chat->getUser1() === $this) {
                $chat->setUser1(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setSender($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getSender() === $this) {
                $message->setSender(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, BlockReport>
     */
    public function getBlockReports(): Collection
    {
        return $this->blockReports;
    }

    public function addBlockReport(BlockReport $blockReport): static
    {
        if (!$this->blockReports->contains($blockReport)) {
            $this->blockReports->add($blockReport);
            $blockReport->setReporter($this);
        }

        return $this;
    }

    public function removeBlockReport(BlockReport $blockReport): static
    {
        if ($this->blockReports->removeElement($blockReport)) {
            // set the owning side to null (unless already changed)
            if ($blockReport->getReporter() === $this) {
                $blockReport->setReporter(null);
            }
        }

        return $this;
    }

    /**
     * Convert User object to an Array for later use on json to send User data
     * 
     * @return array
     */
    public function toArray(): array
    {
        $userData = [
            'id' => $this->getId(),
            'username' => $this->getUsername(),
            'email' => $this->getEmail(),
            'created_at' => $this->getCreatedAt() ? $this->getCreatedAt()->format('Y-m-d H:i:s') : null,
            'roles' => $this->getRoles(),
        ];

        if ($this->getProfile()) {
            $userData['profile'] = $this->getProfile()->toArray();
        }

        // if ($this->getImage()) {
        //     $userData['image'] = $this->getImage()->toArray();
        // }

        if ($this->getPreference()) {
            $userData['preference'] = $this->getPreference()->toArray();
        }

        $userData['likes'] = [];
        foreach ($this->getLikes() as $like) {
            $userData['likes'][] = $like->toArray();
        }

        $userData['matches'] = [];
        foreach ($this->getMatches() as $match) {
            $userData['matches'][] = $match->toArray();
        }

        $userData['chats'] = [];
        foreach ($this->getChats() as $chat) {
            $userData['chats'][] = $chat->toArray();
        }

        $userData['messages'] = [];
        foreach ($this->getMessages() as $message) {
            $userData['messages'][] = $message->toArray();
        }

        $userData['block_reports'] = [];
        foreach ($this->getBlockReports() as $blockReport) {
            $userData['block_reports'][] = $blockReport->toArray();
        }

        return $userData;
    }

    /**
     * @return Collection<int, Dislike>
     */
    public function getDislikeGiven(): Collection
    {
        return $this->dislikeGiven;
    }

    public function addDislikeGiven(Dislike $dislikeGiven): static
    {
        if (!$this->dislikeGiven->contains($dislikeGiven)) {
            $this->dislikeGiven->add($dislikeGiven);
            $dislikeGiven->setDisliker($this);
        }

        return $this;
    }

    public function removeDislikeGiven(Dislike $dislikeGiven): static
    {
        if ($this->dislikeGiven->removeElement($dislikeGiven)) {
            // set the owning side to null (unless already changed)
            if ($dislikeGiven->getDisliker() === $this) {
                $dislikeGiven->setDisliker(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Dislike>
     */
    public function getDislikesReceived(): Collection
    {
        return $this->dislikesReceived;
    }

    public function addDislikesReceived(Dislike $dislikesReceived): static
    {
        if (!$this->dislikesReceived->contains($dislikesReceived)) {
            $this->dislikesReceived->add($dislikesReceived);
            $dislikesReceived->setDisliked($this);
        }

        return $this;
    }

    public function removeDislikesReceived(Dislike $dislikesReceived): static
    {
        if ($this->dislikesReceived->removeElement($dislikesReceived)) {
            // set the owning side to null (unless already changed)
            if ($dislikesReceived->getDisliked() === $this) {
                $dislikesReceived->setDisliked(null);
            }
        }

        return $this;
    }
}
