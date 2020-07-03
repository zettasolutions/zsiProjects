CREATE PROCEDURE [dbo].[company_info_upd] (
  @company_id   int = null
 ,@company_name nvarchar(100)
 ,@company_address nvarchar(100)
 ,@city_id int
 ,@contact_name nvarchar(100)
 ,@company_landline nvarchar(20)
 ,@company_mobile   nvarchar(20)
 ,@company_tin      nvarchar(20)
 ,@bank_id          int
 ,@account_no       nvarchar(20)
 ,@is_edited        char(1) = 'N'
 ,@user_id          int = null
 ,@id				INT=NULL --OUTPUT 
 ,@is_zfare        char(1) = null
 ,@is_zload        char(1) = null
)
AS
BEGIN
  SET @id = @company_id
  IF ISNULL(@company_id,0)=0
  BEGIN
	  DECLARE @seq_no int
	  SELECT @seq_no =seq_no FROM dbo.sequence
	  INSERT INTO dbo.company_info
	  ( company_name
	   ,company_tin
	   ,contact_name
	   ,company_landline
	   ,company_mobile   
	   ,company_address
	   ,city_id
	   ,bank_id
	   ,account_no
	   ,registration_code
	   ,company_code
	   ,is_zfare
	   ,is_zload
	   ,created_date
	   )VALUES 
	   (
		 @company_name
		,@company_tin
		,@contact_name
		,@company_landline
		,@company_mobile   
		,@company_address
		,@city_id
		,@bank_id
		,@account_no
		,newid()
		,CONCAT(SUBSTRING(@company_name,1,3),@seq_no)
		,@is_zfare
		,@is_zload
		,GETDATE()
	   );
	   SET @id = @@IDENTITY
	   UPDATE dbo.sequence SET seq_no = seq_no + 1;
	   RETURN @id;
   END
ELSE
   UPDATE dbo.company_info SET
          contact_name  =@contact_name  
		 ,company_landline=@company_landline
		 ,company_mobile  =@company_mobile   
		 ,company_address=@company_address
		 ,city_id=@city_id
    	 ,bank_id=@bank_id
		 ,account_no=@account_no
		 ,updated_by = @user_id
		 ,updated_date = GETDATE();
		 
END;



