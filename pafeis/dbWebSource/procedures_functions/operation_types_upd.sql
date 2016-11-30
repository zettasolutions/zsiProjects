CREATE PROCEDURE [dbo].[operation_types_upd]
(
    @tt    operation_types_tt READONLY
   ,@user_id int
)
AS

BEGIN
  SET NOCOUNT ON
-- Update Process
    UPDATE a 
	 SET operation_type_code	= b.operation_type_code
		,operation_type_name	= b.operation_type_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.operation_types a INNER JOIN @tt b
    ON a.operation_type_id = b.operation_type_id
    WHERE (
	        isnull(a.operation_type_code,'')		<> isnull(b.operation_type_code,'')  
		OR	isnull(a.operation_type_name,'')		<> isnull(b.operation_type_name,'')  
		OR	isnull(a.is_active,'')			        <> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.operation_types (
         operation_type_code 
		,operation_type_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        operation_type_code 
	   ,operation_type_name	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE operation_type_id IS NULL;
END


