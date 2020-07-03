
CREATE procedure [dbo].[zfleet_form_upd](
   @id  int=null
  ,@position_apply  nvarchar(10)=null
  ,@name nchar(10)=null
  ,@email_add nvarchar(50)=null
  ,@phone_no nvarchar(50)=null
  ,@description nvarchar(50)=null
  ,@application_letter  nvarchar(50) = null
  ,@file_name  nvarchar(50) = null
  ,@user_id int = null
)
as 
SET NOCOUNT ON 
	SELECT * FROM dbo.zfleet_test_form
	SET @id = @id 
	IF ISNULL(@id,0)=0
	BEGIN
	INSERT INTO dbo.zfleet_test_form
		(
		position_apply
		,name 
		,email_add
		,phone_no
		,description
		,application_letter
		,file_name 
		) VALUES
		(
		@position_apply
		,@name
		,@email_add
		,@phone_no
		,@description
		,@application_letter
		,@file_name 
		);
		SET @id = @@IDENTITY
		 
		RETURN @id; 
END
	 
 


