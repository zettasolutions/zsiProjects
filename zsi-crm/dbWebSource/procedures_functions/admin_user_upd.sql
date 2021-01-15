
CREATE procedure [dbo].[admin_user_upd](
   @client_id  int=null
  ,@logon    nvarchar(50)=null
  ,@last_name nvarchar(100)=null
  ,@first_name nvarchar(100)=null
  ,@middle_name nvarchar(1)=null
  ,@name_suffix nvarchar(50)=null
  ,@user_id   int
  ,@is_active char(1)='Y'
  ,@is_admin char(1)='Y'
  ,@is_fmis char(1)='N'
  ,@is_hcm char(1)='N'
  ,@is_afcs char(1)='N'
  ,@is_ct char(1)='N'
  ,@id	INT=NULL OUTPUT 
  
)
as
BEGIN
   SET NOCOUNT ON
    Declare @Encrypt varbinary(100)  
  
    DECLARE @LENGTH INT,@CharPool varchar(26),@PoolLength varchar(26),@LoopCount  INT  
	DECLARE @RandomString VARCHAR(10),@CHARPOOLINT VARCHAR(9)  
  
    
	SET @CharPool = 'zAyBxCwDvEuFtGsHrIqJpKoLnMmNlPkQjRiShTgUfVeWdXcYbZa'  
	DECLARE @TMPSTR VARCHAR(3)  

	SET @PoolLength = DataLength(@CharPool)  
	SET @LoopCount = 0  
	SET @RandomString = ''  
  
		WHILE (@LoopCount <10)  
		BEGIN  
			SET @TMPSTR =   SUBSTRING(@Charpool, CONVERT(int, RAND() * @PoolLength), 1)           
			SELECT @RandomString  = @RandomString + CONVERT(VARCHAR(5), CONVERT(INT, RAND() * 10))  
			IF(DATALENGTH(@TMPSTR) > 0)  
			BEGIN   
				SELECT @RandomString = @RandomString + @TMPSTR    
				SELECT @LoopCount = @LoopCount + 1  
			END  
		END  
		SET @LOOPCOUNT = 0    

		SET @Encrypt = EncryptByPassPhrase('key', @RandomString )  

		INSERT INTO dbo.users
		 (
		  logon
		 ,password
		 ,last_name
		 ,first_name
		 ,middle_name
		 ,name_suffix
		 ,is_admin
		 ,client_id
		 ,is_active
		 ,is_fmis
		 ,is_hcm
		 ,is_afcs
		 ,is_ct
		 ,created_by
		 ,created_date
		 
		 ) VALUES
		 (
		  @logon
		 ,@Encrypt
		 ,@last_name
		 ,@first_name
		 ,@middle_name
		 ,@name_suffix
		 ,@is_admin
		 ,@client_id
		 ,@is_active
		 ,@is_fmis	
		 ,@is_hcm	
		 ,@is_afcs	
		 ,@is_ct
		 ,@user_id
		 ,DATEADD(HOUR, 8, GETUTCDATE())
		 ) 
	SET @id = @@IDENTITY
	RETURN @id; 
END;
