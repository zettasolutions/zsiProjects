




create PROCEDURE [dbo].[subscriptions_upd]
(
    @tt    subscriptions_tt READONLY
   ,@user_id int
)
AS

BEGIN
SET NOCOUNT ON
DECLARE @client_id int
-- Update Process
    UPDATE a 
    SET  subscription_date		= b.subscription_date
	    ,no_months              = b.no_months
		,expiry_date            = DateAdd(month,b.no_months,b.subscription_date)
		,is_active				= b.is_active
        ,updated_by				= @user_id
        ,updated_date			= GETDATE()
    FROM dbo.subscriptions a INNER JOIN @tt b
    ON a.subscription_id = b.subscription_id
    WHERE isnull(b.is_edited,'N') = 'Y' ;

	   
-- Insert Process
    SELECT @client_id=client_id FROM dbo.users where user_id=@user_id;
    INSERT INTO dbo.subscriptions (
         app_id
		,subscription_date
		,no_months
		,expiry_date
		,client_id    
	    ,is_active
        ,created_by
        ,created_date
        )
    SELECT 
         app_id
		,subscription_date
		,no_months
		,DateAdd(month,no_months,subscription_date)
       ,@client_id 
	   ,is_active 
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE subscription_id IS NULL
	and app_id IS NOT NULL;
END








