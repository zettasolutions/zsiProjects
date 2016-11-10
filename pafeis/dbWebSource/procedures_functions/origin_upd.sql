
-- =============================================
-- Author:		Rogelio T. Novo Jr.
-- Create date: October 24, 2016 10:01 PM
-- Description:	Origin update all records or by id records.
-- =============================================
CREATE PROCEDURE [dbo].[origin_upd]
(
    @tt    origin_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  origin_code    		= b.origin_code
		,origin_name			= b.origin_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.origin a INNER JOIN @tt b
    ON a.origin_id = b.origin_id
    WHERE (
			isnull(a.origin_code,'')		<> isnull(b.origin_code,'')  
		OR	isnull(a.origin_name,'')		<> isnull(b.origin_name,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.origin (
         origin_code 
		,origin_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        origin_code 
	   ,origin_name	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE origin_id IS NULL;
END


