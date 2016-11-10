
CREATE PROCEDURE [dbo].[dealer_upd]
(
    @tt    dealer_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET  dealer_name			= b.dealer_name
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.dealer a INNER JOIN @tt b
    ON a.dealer_id = b.dealer_id
    WHERE (
			isnull(a.dealer_name,'')		<> isnull(b.dealer_name,'')  
		OR	isnull(a.is_active,'')			<> isnull(b.is_active,'')  
	)
	   
-- Insert Process
    INSERT INTO dbo.dealer (
         dealer_name
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        dealer_name	
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE dealer_id IS NULL;
END

