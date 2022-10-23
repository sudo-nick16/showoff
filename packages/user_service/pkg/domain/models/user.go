package models

// user model
type User struct {
	ID          uint   `json:"id,omitempty" gorm:"primaryKey;autoIncrement;uniqueIndex:idx1"`
	Name        string `json:"name,omitempty" gorm:"not null;default:null"`
	Email       string `json:"email,omitempty" gorm:"unique;not null;default:null;uniqueIndex:idx2"`
	Username    string `json:"username,omitempty" gorm:"unique;not null;default:null;uniqueIndex:idx3"`
	Password    string `json:"password,omitempty" gorm:"not null;default:null"`
    Bio         string `json:"bio,omitempty" gorm:"not null;default:null"`
	GithubID    string `json:"github_id,omitempty" gorm:"unique;uniqueIndex:idx4"`
	LinkedinURL string `json:"linkedin_url,omitempty" gorm:"unique;uniqueIndex:idx5"`
	WebsiteURL  string `json:"website_url,omitempty" gorm:"unique;uniqueIndex:idx6"`
	CreatedAt   int64  `json:"createdAt,omitempty" gorm:"autoCreateTime"`
	UpdatedAt   int64  `json:"updatedAt,omitempty" gorm:"autoUpdateTime"`
}
