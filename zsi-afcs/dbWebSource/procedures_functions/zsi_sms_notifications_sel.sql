
CREATE PROCEDURE [dbo].[zsi_sms_notifications_sel]  
(  
   @user_id INT = NULL
)  
AS  
BEGIN  
	SET NOCOUNT ON;

	SELECT
		TOP 5
		[sms_notification_id]
		, [mobile_no]
		, [message]
	FROM [dbo].[sms_notifications]
	WHERE 1= 1
	AND [app_name] IN ('zpay','zload')
	AND [is_processed] = 'N'
END;