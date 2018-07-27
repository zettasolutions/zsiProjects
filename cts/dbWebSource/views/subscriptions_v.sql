
CREATE VIEW [dbo].[subscriptions_v]
AS
SELECT        dbo.subscriptions.subscription_id, dbo.subscriptions.subscription_date, dbo.subscriptions.no_months, dbo.subscriptions.expiry_date, dbo.subscriptions.app_id, dbo.subscriptions.client_id, 
                         dbo.subscriptions.is_active, dbo.applications.app_name
FROM            dbo.subscriptions INNER JOIN
                         dbo.applications ON dbo.subscriptions.app_id = dbo.applications.app_id

