module Generate where

import Test.QuickCheck
import Data.List

{-
 - choose
 - frequency
 - elements
 -}

type Name = String
data Email = Email String

instance Show Email where
    show (Email s) = show s

instance Arbitrary Email where
    arbitrary = do
        s <- elements emails
        return $ Email s

type Password = String
data GroupName = GroupName String
    deriving Eq

instance Show GroupName where
    show (GroupName s) = show s 

names :: [Name]
names = ["Artur"]

emails :: [String]
emails = ["artur@mail.com"]

passwords :: [Password]
passwords = ["password"]

groupNames :: [String]
groupNames = ["grupoArtur"]

data User = User
    { name :: Name
    , email :: Email
    , password :: String
    , favourite :: [GroupName]
    }

instance Show User where
    show (User n e p f) = 
        "{" ++ na ++ "," 
            ++ em ++ ","
            ++ pa ++ ","
            ++ fa ++ "}"
        where 
            na = "\"name\": " ++ show n
            em = "\"email\": " ++ show e
            pa = "\"password\": " ++ show p
            fa = "\"favourite\": " ++ show f

instance Arbitrary GroupName where
    arbitrary = do
        s <- elements groupNames
        return $ GroupName s

instance Arbitrary User where
    arbitrary = do
        n <- elements names
        e <- arbitrary :: Gen Email
        p <- elements passwords
        f <- arbitrary :: Gen [GroupName]
        return $ User n e p (nub f)

data Path = Path [GroupName]

unGroupName :: GroupName -> String
unGroupName (GroupName s) = s

instance Arbitrary Path where
    arbitrary = do
        l <- arbitrary :: Gen [GroupName]
        return $ Path l

instance Show Path where
    show (Path l) = foldr ((++) . (++ "/")) "" $ map unGroupName l

data Card = Card String String

instance Arbitrary Card where
    arbitrary = do
        k <- elements keys
        v <- elements values
        return $ Card k v

instance Show Card where
    show (Card k v) = 
        "{" ++ (show k) ++ ": " ++ (show v) ++ "}"

type Key = String
type Value = String

keys :: [Key]
keys = ["p", "h1", "img"]

values :: [Value]
values = ["Hello World!"]

data Group = Group
    { path :: Path
    , id_creator :: Email
    , gname :: GroupName
    , sub_groups :: [GroupName]
    , read_perm :: [Email]
    , write_perm :: [Email]
    , page :: [Card]
    }

instance Show Group where
    show (Group pt i g s r w pg) = 
        "{" ++ pa ++ "," 
            ++ id ++ ","
            ++ na ++ ","
            ++ su ++ ","
            ++ re ++ ","
            ++ wr ++ ","
            ++ pe ++ "}"
        where 
            pa = "\"path\": " ++ show pt
            id = "\"id_creator\": " ++ show i
            na = "\"name\": " ++ show g
            su = "\"sub_groups\": " ++ show s
            re = "\"read_perm\": " ++ show r
            wr = "\"write_perm\": " ++ show w
            pe = "\"page\": " ++ show pg

instance Arbitrary Group where
    arbitrary = do
        pt <- arbitrary :: Gen Path
        i  <- arbitrary :: Gen Email
        g  <- arbitrary :: Gen GroupName
        s  <- arbitrary :: Gen [GroupName]
        r  <- arbitrary :: Gen [Email]
        w  <- arbitrary :: Gen [Email]
        pg <- arbitrary :: Gen [Card]
        return $ Group pt i g s r w pg
